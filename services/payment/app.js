const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

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
        return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
    }

    try {
        const [rows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.userEmail = rows[0].email;
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

// Endpoint untuk melakukan pembayaran
app.post('/api/payments', authenticateUser, async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
        return res.status(400).json({ message: 'Order ID dan metode pembayaran diperlukan.' });
    }

    try {
        // Periksa apakah pesanan ada dan belum dibayar
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND email = ? AND payment = "unpaid"',
            [orderId, req.userEmail]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibayar.' });
        }

        // Update status pembayaran dan pesanan
        await db.query(
            'UPDATE orders SET payment = ?, status = "sedang dikirim" WHERE order_id = ?',
            ['paid', orderId]
        );

        res.status(200).json({ message: 'Pembayaran berhasil.', orderId });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pembayaran.' });
    }
});

// Jalankan Payment Service
const PORT = process.env.PAYMENT_SERVICE_PORT || 3004;
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
