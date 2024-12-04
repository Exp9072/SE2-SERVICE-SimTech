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
            'SELECT * FROM orders WHERE email = ? ORDER BY order_date DESC',
            [req.userEmail]
        );
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan.' });
    }
});

// Jalankan Order Service
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
