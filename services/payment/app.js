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

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason, 'at', promise);
});

// Koneksi ke database
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'simtech',
});

// Middleware untuk memverifikasi pengguna
async function authenticateUser(req, res, next) {
    const userId = req.headers['user-id'];

    if (!userId) {
        console.error('Authentication failed: Missing user ID'); // Debugging
        return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
        const [rows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            console.error('Authentication failed: User not found'); // Debugging
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.userEmail = rows[0].email;
        console.log('Authentication successful:', req.userEmail); // Debugging
        next();
    } catch (error) {
        console.error('Error authenticating user:', error); // Debugging
        res.status(500).json({ message: 'Internal server error.' });
    }
}

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

module.exports = { connectRabbitMQ, getRabbitChannel };
// Hubungkan RabbitMQ
connectRabbitMQ();
// Endpoint untuk melakukan pembayaran
app.post('/api/payments', async (req, res) => {
    const { orderId, paymentMethod} = req.body;
    const userEmail = req.headers['user-email'];
    console.log("Order Id :", orderId);
    console.log("Payment Method :", paymentMethod);
    console.log("User Email :", userEmail);
    

    if (!orderId || !paymentMethod) {
        return res.status(400).json({ message: 'Order ID dan metode pembayaran diperlukan.' });
    }

    try {
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND email = ? AND payment = "unpaid"',
            [orderId, req.headers['user-email']]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibayar.' });
        }

        // Tambahkan logika untuk memeriksa apakah pesan sudah dikirim sebelumnya
        const [existingPayment] = await db.query(
            'SELECT * FROM payments WHERE order_id = ?',
            [orderId]
        );

        if (existingPayment.length > 0) {
            return res.status(400).json({ message: 'Pembayaran untuk pesanan ini sudah diproses.' });
        }

        await db.query(
            'UPDATE orders SET payment = ?, status = ? WHERE order_id = ?',
            ['paid', 'sedang dikirim', orderId]
        );

        await db.query(
            'INSERT INTO payments (order_id, email, payment_method, amount) VALUES (?, ?, ?, ?)',
            [orderId, req.headers['user-email'], paymentMethod, order[0].total_price]
        );

        const paymentData = {
            orderId,
            paymentMethod,
            amount: order[0].total_price,
            paymentDate: new Date().toISOString(),
        };

        const channel = getRabbitChannel();
        await channel.assertQueue('payment_queue');
        channel.sendToQueue('payment_queue', Buffer.from(JSON.stringify(paymentData)));

        console.log('Payment message sent to RabbitMQ:', paymentData);
        res.status(200).json({ message: 'Pembayaran berhasil.', paymentData });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pembayaran.' });
    }
});


app.get('/api/payments/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const userEmail = req.headers['user-email']; // Ambil email dari header

    if (!userEmail) {
        console.error('Missing user-email in headers');
        return res.status(401).json({ message: 'Unauthorized: Missing email in headers.' });
    }

    try {
        const [paymentDetails] = await db.query(`
            SELECT payment_id, order_id, email, payment_method, payment_date, amount
            FROM payments
            WHERE order_id = ? AND email = ?
        `, [orderId, userEmail]);

        if (paymentDetails.length === 0) {
            return res.status(404).json({ message: 'Detail pembayaran tidak ditemukan.' });
        }

        res.json(paymentDetails[0]);
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail pembayaran.' });
    }
});

app.post('/api/payments/cancel/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const userEmail = req.headers['user-email'];

    if (!orderId || !userEmail) {
        return res.status(400).json({ message: 'Order ID dan email diperlukan.' });
    }

    try {
        // Pastikan pembayaran belum selesai
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND email = ? AND payment = "unpaid"',
            [orderId, userEmail]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah diproses.' });
        }

        // Kembalikan stok barang
        const [orderItems] = await db.query(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [orderId]
        );

        for (const item of orderItems) {
            await db.query(
                'UPDATE items SET stock_quantity = stock_quantity + ? WHERE item_id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Hapus pembayaran dan set status pesanan
        await db.query('DELETE FROM payments WHERE order_id = ?', [orderId]);
        await db.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
        await db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);

        res.status(200).json({ message: 'Pembayaran dibatalkan dan stok berhasil dikembalikan.' });
    } catch (error) {
        console.error('Error canceling payment:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membatalkan pembayaran.', error: error.message });
    }
});


// Debugging
app.get('/api/rabbitmq-test', async (req, res) => {
    try {
        const channel = getRabbitChannel();
        await channel.assertQueue('test_queue');
        channel.sendToQueue('test_queue', Buffer.from('Test message'));
        res.status(200).json({ message: 'Message sent to test_queue.' });
    } catch (error) {
        console.error('RabbitMQ test failed:', error);
        res.status(500).json({ message: 'RabbitMQ test failed.', error: error.message });
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

// Jalankan Payment Service
const PORT = process.env.PAYMENT_SERVICE_PORT || 3004;
app.listen(PORT, '0.0.0.0', () => console.log(`Payment service running on port ${PORT}`));
