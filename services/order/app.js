const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
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

const { connectRabbitMQ, getRabbitChannel } = require('../../rabbitmq/rabbitmq');

// Hubungkan RabbitMQ saat layanan mulai
connectRabbitMQ()
    .then(async () => {
        const channel = getRabbitChannel();

        // Konsumsi pesan dari queue
        await channel.assertQueue('payment_queue');
        channel.consume('payment_queue', async (message) => {
            if (message) {
                let paymentData;
                try {
                    paymentData = JSON.parse(message.content.toString());
                } catch (error) {
                    console.error('Invalid message format:', error);
                    channel.nack(message, false, false); // Tolak pesan jika format tidak valid
                    return;
                }
        
                if (!paymentData.orderId || !paymentData.paymentMethod) {
                    console.error('Invalid message content:', paymentData);
                    channel.nack(message, false, false); // Tolak pesan jika data tidak lengkap
                    return;
                }
        
                try {
                    await db.query(
                        'UPDATE orders SET status = "sedang dikemas" WHERE order_id = ?',
                        [paymentData.orderId]
                    );
                    console.log(`Order ${paymentData.orderId} status updated.`);
                    channel.ack(message);
                } catch (error) {
                    console.error('Error updating order status:', error);
                    channel.nack(message); // Kembalikan pesan ke queue
                }
            }
        });
        
    })
    .catch((error) => {
        console.error('Error setting up RabbitMQ consumer:', error);
    });


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
                throw new Error(`Stok tidak cukup untuk produk ID ${item.item_id}.`);
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

// Jalankan Order Service
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
