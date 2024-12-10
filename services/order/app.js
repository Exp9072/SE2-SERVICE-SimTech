const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
const amqp = require('amqplib');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

// Tangani error global di seluruh proses
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});

// Koneksi ke database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'simtech',
});

// RabbitMQ
let channel = null;

const connectRabbitMQ = async () => {
    let retries = 5;
    while (retries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
            channel = await connection.createChannel();
            console.log('RabbitMQ connected and channel created.');
            return channel;
        } catch (error) {
            console.error(`RabbitMQ connection failed, retries left: ${retries - 1}`, error);
            retries -= 1;
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
    console.error('Exhausted retries for RabbitMQ connection.');
    process.exit(1);
};

const getRabbitChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized. Call connectRabbitMQ first.');
    }
    return channel;
};

// Hubungkan RabbitMQ
connectRabbitMQ()
    .then(async () => {
        const channel = getRabbitChannel();

        // Konsumsi pesan dari queue
        await channel.assertQueue('payment_queue');
        channel.consume('payment_queue', async (message) => {
            if (message) {
                try {
                    const paymentData = JSON.parse(message.content.toString());
                    console.log('Received message from payment_queue:', paymentData);

                    if (!paymentData.orderId || !paymentData.paymentMethod) {
                        console.error('Invalid message content:', paymentData);
                        channel.nack(message, false, false);
                        return;
                    }

                    await db.query(
                        'UPDATE orders SET status = "sedang dikirim" WHERE order_id = ?',
                        [paymentData.orderId]
                    );
                    console.log(`Order ${paymentData.orderId} status updated.`);
                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing payment message:', error);
                    channel.nack(message);
                }
            }
        });
    })
    .catch((error) => {
        console.error('Error setting up RabbitMQ consumer:', error);
    });

module.exports = { connectRabbitMQ, getRabbitChannel };
// Middleware untuk memverifikasi pengguna
async function authenticateUser(req, res, next) {
    const userId = req.headers['user-id']; // ID pengguna yang diteruskan dari layanan otentikasi

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
        const [rows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.userEmail = rows[0].email; // Simpan email pengguna di request object
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Endpoint untuk membuat pesanan baru
app.post('/api/orders', authenticateUser, async (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Keranjang barang tidak boleh kosong.' });
    }

    // Loop melalui setiap item di keranjang dan periksa stok
    for (let item of items) {
        // Query untuk mengambil stok dari produk berdasarkan item_id
        const [product] = await db.query('SELECT stock_quantity FROM items WHERE item_id = ?', [item.item_id]);
        
        // Jika produk tidak ditemukan atau stok tidak cukup
        if (!product || product.stock_quantity < item.quantity) {
            // Kirimkan respons dengan pesan stok tidak cukup
            return res.status(400).json({
                message: `Stok tidak cukup untuk produk: ${item.item_name || item.name}`
            });
        }
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        console.log('Items received for order:', items); // Debugging

        let totalPrice = 0;

        for (const item of items) {
            if (!item.item_id || !item.quantity) {
                throw new Error(`Item tidak valid: ${JSON.stringify(item)}`);
            }

            const [rows] = await connection.query(
                'SELECT price, stock_quantity FROM items WHERE item_id = ?',
                [item.item_id]
            );

            if (rows.length === 0) {
                throw new Error(`Produk dengan ID ${item.item_id} tidak ditemukan.`);
            }

            const { price: pricePerUnit, stock_quantity: stock } = rows[0];

            if (stock < item.quantity) {
                return res.status(400).json({
                    message: `Stok tidak cukup untuk produk: ${item.item_name || item.name}`
                });
                //throw new Error(`Stok tidak cukup untuk produk ID ${item.item_id}.`);
            }

            totalPrice += pricePerUnit * item.quantity;

            // Kurangi stok barang
            await connection.query(
                'UPDATE items SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
                [item.quantity, item.item_id]
            );
        }

        const [orderResult] = await connection.query(
            'INSERT INTO orders (email, order_date, total_price, payment, status) VALUES (?, NOW(), ?, "unpaid", "belum dikirim")',
            [req.userEmail, totalPrice]
        );

        const orderId = orderResult.insertId;

        // Masukkan data ke tabel order_items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.item_id, item.quantity, item.price]
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Pesanan berhasil dibuat.', orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat pesanan.', error: error.message });
    }
});


// Endpoint untuk mengambil daftar pesanan berdasarkan email pengguna
app.get('/api/orders', authenticateUser, async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT order_id, email, order_date, total_price, payment, status FROM orders WHERE email = ? ORDER BY order_date DESC',
            [req.userEmail]
        );
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan.' });
    }
});

app.get('/api/orders/:orderId/items', authenticateUser, async (req, res) => {
    const { orderId } = req.params;

    try {
        const [orderItems] = await db.query(
            `SELECT order_items.product_id, 
                    items.item_name AS name, 
                    order_items.quantity, 
                    order_items.price
             FROM order_items
             JOIN items ON order_items.product_id = items.item_id
             WHERE order_items.order_id = ?`,
            [orderId]
        );

        if (orderItems.length === 0) {
            return res.status(404).json({ message: 'Items not found for this order.' });
        }

        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/test-rabbit', async (req, res) => {
    try {
        const channel = getRabbitChannel();
        await channel.assertQueue('test_queue');
        channel.sendToQueue('test_queue', Buffer.from('Hello RabbitMQ!'));
        res.status(200).json({ message: 'Pesan berhasil dikirim ke RabbitMQ.' });
    } catch (error) {
        console.error('RabbitMQ test failed:', error);
        res.status(500).json({ message: 'RabbitMQ test failed.', error: error.message });
    }
});

app.post('/api/orders/cart', authenticateUser, async (req, res) => {
    const { items } = req.body;
    const email = req.userEmail; // Ambil email pengguna dari middleware

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Keranjang barang tidak boleh kosong.' });
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        console.log('Items received for cart:', items);

        let totalPrice = 0;

        for (const item of items) {
            if (!item.id || !item.price) {
                throw new Error(`Item tidak valid: ${JSON.stringify(item)}`);
            }

            const [rows] = await connection.query(
                'SELECT price, stock_quantity FROM items WHERE item_id = ?',
                [item.id]
            );

            if (rows.length === 0) {
                throw new Error(`Produk dengan ID ${item.id} tidak ditemukan.`);
            }

            const { price: pricePerUnit, stock_quantity: stock } = rows[0];

            if (stock < 1) { // Anggap default quantity = 1
                throw new Error(`Stok tidak cukup untuk produk ID ${item.id}.`);
            }

            totalPrice += pricePerUnit;
        }

        // Buat pesanan baru dengan status 'cart'
        const [orderResult] = await connection.query(
            'INSERT INTO orders (email, order_date, total_price, payment, status) VALUES (?, NOW(), ?, "unpaid", "cart")',
            [email, totalPrice]
        );

        const orderId = orderResult.insertId;

        // Masukkan item ke tabel order_items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, 1, item.price] // Default quantity = 1
            );
        }

        await connection.commit();
        connection.release();

        res.status(201).json({
            message: 'Barang berhasil ditambahkan ke keranjang.',
            orderId,
            totalPrice,
        });
    } catch (error) {
        console.error('Error processing cart:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses keranjang.', error: error.message });
    }
});


// Middleware untuk memverifikasi apakah pengguna adalah admin
async function authenticateAdmin(req, res, next) {
    const userId = req.headers['user-id']; // ID pengguna yang diteruskan dari layanan otentikasi
    console.log('Authenticating admin : ', userId);

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        if (rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have admin privileges.' });
        }

        next();
    } catch (error) {
        console.error('Error authenticating admin:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Endpoint untuk mengupdate status pengiriman menjadi "Sudah Dikirim"
app.patch('/api/orders/:orderId/status', authenticateAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;  // Mengambil status dari body request

    try {
        // Memeriksa apakah pesanan ada dan statusnya belum "Sudah Dikirim"
        console.log('Cek Status');
        const [order] = await db.query(
            'SELECT status FROM orders WHERE order_id = ?',
            [orderId]
        );

        if (order.length === 0) {
            console.log('cek pesanan ada apa tidak');
            return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
        }

        if (order[0].status === 'Sudah Dikirim') {
            console.log('cek status sudah dikirim apa tidak');
            return res.status(400).json({ message: 'Status sudah "Sudah Dikirim".' });
        }

        // Update status pesanan dengan status yang diterima di body
        await db.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );
        console.log('status pesanan berhasil diganti');
        res.status(200).json({ message: `Status pesanan ${orderId} berhasil diupdate menjadi "${status}".` });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate status pesanan.' });
    }
});

// Endpoint untuk menghapus pesanan yang status pembayaran "unpaid"
app.delete('/api/orders/:orderId', authenticateAdmin, async (req, res) => {
    const { orderId } = req.params;

    try {
        // Memeriksa apakah pesanan ada dan status pembayaran "unpaid"
        const [order] = await db.query(
            'SELECT payment FROM orders WHERE order_id = ?',
            [orderId]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
        }

        if (order[0].payment !== 'unpaid') {
            return res.status(400).json({ message: 'Pesanan tidak dapat dihapus karena status pembayaran bukan "unpaid".' });
        }

        // Ambil semua item dalam pesanan dari tabel order_items
        const [orderItems] = await db.query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [orderId]
        );

        if (orderItems.length === 0) {
            return res.status(404).json({ message: 'Item pesanan tidak ditemukan.' });
        }

        // Mengembalikan stok ke tabel items
        for (let item of orderItems) {
            await db.query(
                'UPDATE items SET stock_quantity = stock_quantity + ? WHERE item_id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Hapus item dari tabel order_items
        await db.query(
            'DELETE FROM order_items WHERE order_id = ?',
            [orderId]
        );

        // Hapus pesanan dari tabel orders
        await db.query(
            'DELETE FROM orders WHERE order_id = ?',
            [orderId]
        );

        res.status(200).json({ message: `Pesanan ${orderId} berhasil dihapus dan stok telah diperbarui.` });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus pesanan.' });
    }
});

// Jalankan Order Service
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
app.listen(PORT, '0.0.0.0', () => console.log(`Order service running on port ${PORT}`));
