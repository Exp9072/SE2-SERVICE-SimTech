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
    const { cart_items } = req.body;
    const userId = req.headers['user-id'];

    try {
        // Periksa stok untuk semua item sebelum membuat pesanan
        for (const item of cart_items) {
            const [stockResult] = await db.query(
                'SELECT stock_quantity FROM items WHERE item_id = ? FOR UPDATE',
                [item.product_id]
            );

            if (stockResult.length === 0) {
                return res.status(404).json({
                    message: `Produk dengan ID ${item.product_id} tidak ditemukan.`
                });
            }

            const availableStock = parseInt(stockResult[0].stock_quantity);
            const requestedQuantity = parseInt(item.quantity);
            
            console.log(`Product ${item.product_id} - Available: ${availableStock}, Requested: ${requestedQuantity}`);
            
            if (availableStock < requestedQuantity) {
                return res.status(400).json({
                    message: 'Stok tidak cukup untuk beberapa produk di keranjang.'
                });
            }
        }

        // Mulai transaksi
        await db.query('START TRANSACTION');

        try {
            // Buat pesanan baru
            const [userResult] = await db.query(
                'SELECT email FROM users WHERE id = ?',
                [userId]
            );

            if (userResult.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ message: 'User not found' });
            }

            const [orderResult] = await db.query(
                'INSERT INTO orders (email, order_date, payment) VALUES (?, NOW(), "unpaid")',
                [userResult[0].email]
            );
            const orderId = orderResult.insertId;

            // Masukkan item pesanan dan kurangi stok
            let totalPrice = 0;
            for (const item of cart_items) {
                // Dapatkan harga produk
                const [priceResult] = await db.query(
                    'SELECT price FROM items WHERE item_id = ?',
                    [item.product_id]
                );
                const itemPrice = priceResult[0].price * item.quantity;
                totalPrice += itemPrice;

                // Masukkan item ke order_items
                await db.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, itemPrice]
                );

                // Kurangi stok
                await db.query(
                    'UPDATE items SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
                    [item.quantity, item.product_id]
                );
            }

            // Update total harga pesanan
            await db.query(
                'UPDATE orders SET total_price = ? WHERE order_id = ?',
                [totalPrice, orderId]
            );

            // Commit transaksi
            await db.query('COMMIT');

            res.status(201).json({
                message: 'Pesanan berhasil dibuat.',
                order_id: orderId,
                total_price: totalPrice
            });
        } catch (error) {
            // Rollback jika terjadi error
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat pesanan.' });
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
            return res.status(403).json({ message: 'Forbidden: Tidak mempunyai ADMIN Privilege.' });
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

// Endpoint untuk mendapatkan semua pesanan, dengan opsi filter berdasarkan status pembayaran
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
    const { payment, status } = req.query;
    
    try {
        let query = 'SELECT * FROM orders';
        let queryParams = [];
        
        let conditions = [];
        if (status && status !== 'all') {
            conditions.push('status = ?');
            queryParams.push(status);
        }
        if (payment && payment !== 'all') {
            conditions.push('payment = ?');
            queryParams.push(payment);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY order_date DESC';
        console.log('Query:', query, 'Params:', queryParams); // Debug log
        
        const [orders] = await db.query(query, queryParams);
        console.log('Fetched orders:', orders); // Debug log
        
        res.status(200).json({
            message: 'Data pesanan berhasil diambil.',
            orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan.' });
    }
});

// Delete unpaid order (admin only)
app.delete('/orders/:orderId', authenticateAdmin, async (req, res) => {
    const { orderId } = req.params;

    try {
        // Check if order exists and is unpaid
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND payment = "unpaid"',
            [orderId]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found or already paid' });
        }

        // Delete order and related items
        await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
        await db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update order status (admin only)
app.patch('/orders/:orderId/status', authenticateAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log('Received status update request:', { orderId, status });

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    // Validate status value
    const validStatuses = ['sedang dikirim', 'sudah dikirim'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: 'Invalid status. Must be either "sedang dikirim" or "sudah dikirim"' 
        });
    }

    try {
        // Verify order exists and is paid
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [orderId]
        );
        
        if (order.length === 0) {
            console.log('Order not found:', orderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow status updates for paid orders
        if (order[0].payment !== 'paid') {
            console.log('Cannot update unpaid order:', orderId);
            return res.status(400).json({ message: 'Cannot update status of unpaid order' });
        }
        
        // Update the status
        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );
        
        console.log('Update result:', result);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Failed to update order status' });
        }
        
        console.log('Order status updated successfully');
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Jalankan Order Service
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
app.listen(PORT, '0.0.0.0', () => console.log(`Order service running on port ${PORT}`));
