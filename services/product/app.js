const express = require('express');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Middleware
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'simtech',
});

// Middleware untuk memverifikasi apakah pengguna adalah admin
async function authenticateAdmin(req, res, next) {
    const userId = req.headers['user-id'];
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

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items');
        console.log('Products fetched:', rows); // Debugging
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

// Endpoint untuk menambah produk baru (admin only)
app.post('/api/products', authenticateAdmin, async (req, res) => {
    const {
        item_name,
        item_type,
        brand,
        model,
        price,
        stock_quantity,
        image_url,
        socket_type,
        ram_type,
        pci_version,
        min_watt,
        details
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO items (
                item_name, item_type, brand, model, price, stock_quantity, 
                image_url, socket_type, ram_type, pci_version, min_watt, details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                item_name, item_type, brand, model, price, stock_quantity,
                image_url, socket_type, ram_type, pci_version, min_watt, details
            ]
        );

        res.status(201).json({
            message: 'Product added successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk menambah stok produk (admin only)
app.patch('/api/products/stock', authenticateAdmin, async (req, res) => {
    const { item_name, stock } = req.body;

    try {
        // Verify if stock is positive
        if (!stock || stock <= 0) {
            return res.status(400).json({ 
                error: 'Invalid stock value. Stock must be greater than 0.' 
            });
        }

        // Get current stock first
        const [currentStock] = await db.query(
            'SELECT stock_quantity FROM items WHERE item_name = ?',
            [item_name]
        );

        if (currentStock.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const [result] = await db.query(
            'UPDATE items SET stock_quantity = stock_quantity + ? WHERE item_name = ?',
            [stock, item_name]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ 
            message: 'Stock updated successfully',
            item_name: item_name,
            previous_stock: currentStock[0].stock_quantity,
            added_stock: stock,
            new_stock: currentStock[0].stock_quantity + stock
        });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mengubah harga produk (admin only)
app.patch('/api/products/price', authenticateAdmin, async (req, res) => {
    const { item_name, price } = req.body;

    try {
        // Verify price is valid
        if (!price || price <= 0) {
            return res.status(400).json({ 
                error: 'Invalid price value. Price must be greater than 0.' 
            });
        }

        const [result] = await db.query(
            'UPDATE items SET price = ? WHERE item_name = ?',
            [price, item_name]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ 
            message: 'Price updated successfully',
            item_name: item_name,
            new_price: price
        });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mendapatkan semua produk dengan detail stok (admin only)
app.get('/api/inventory', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                item_id,
                item_name,
                item_type,
                brand,
                model,
                stock_quantity,
                price,
                image_url,
                socket_type,
                ram_type,
                pci_version,
                min_watt,
                details
            FROM items
            ORDER BY item_type, item_name
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mendapatkan statistik inventory (admin only)
app.get('/api/inventory/stats', authenticateAdmin, async (req, res) => {
    try {
        const [lowStock] = await db.query(
            'SELECT COUNT(*) as count FROM items WHERE stock_quantity < 5'
        );
        const [totalProducts] = await db.query(
            'SELECT COUNT(*) as count FROM items'
        );
        const [totalValue] = await db.query(
            'SELECT SUM(stock_quantity * price) as total FROM items'
        );
        
        res.json({
            lowStockCount: lowStock[0].count,
            totalProducts: totalProducts[0].count,
            totalValue: totalValue[0].total || 0
        });
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint untuk mendapatkan riwayat perubahan stok (admin only)
app.get('/api/inventory/history', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                i.item_id,
                i.item_name,
                oi.quantity,
                o.order_date,
                o.status
            FROM items i
            JOIN order_items oi ON i.item_id = oi.product_id
            JOIN orders o ON oi.order_id = o.order_id
            ORDER BY o.order_date DESC
            LIMIT 50
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching inventory history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Jalankan server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});
