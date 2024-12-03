const express = require('express');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'simtech',
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mendapatkan detail produk berdasarkan item_id
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM items WHERE item_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mengurangi stok produk
app.put('/api/products/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const [product] = await db.query('SELECT stock_quantity FROM items WHERE item_id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const stock = product[0].stock_quantity;

        if (stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock' });
        }

        await db.query('UPDATE items SET stock_quantity = stock_quantity - ? WHERE item_id = ?', [quantity, id]);
        res.json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Jalankan server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});
