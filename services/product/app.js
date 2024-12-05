const express = require('express');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const amqp = require('amqplib');

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

// fungsionalitas rabbit mq
// RabbitMQ connection variables
const amqpUrl = 'amqp://localhost';

// Queue name to send messages to
const productQueue = 'products';

let connection, productChannel;

// Function to initialize RabbitMQ connection and channel
async function initRabbitMQ() {
  try {
    // Create a single RabbitMQ connection 
    connection = await amqp.connect(amqpUrl);

    // make channel
    productChannel = await connection.createChannel();

    // Assert queue (ensure it exists)
    await productChannel.assertQueue(productQueue, { durable: false });

    console.log('RabbitMQ connection established');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit process if RabbitMQ connection fails
  }
}

/**
 * Receives messages from a RabbitMQ queue.
 * @param {string} queue - The name of the queue to receive messages from.
 * @param {function} callback - A callback function to process each received message.
 */
async function receiveMessage(queue, callback) {
    try {
      // Choose the appropriate channel
      const channel = queue === productQueue ? productChannel : productChannel;
        console.log('listening for queue: ', queue); // debugging juga
        console.log('product channel is alive? ', channel !== undefined); // debugging juga
        
      // only engage if channel exist   
      if (channel !== undefined) {
        // Consume messages from the queue
        await channel.consume(queue, (msg) => {
            if (msg !== null) {
            const messageContent = msg.content.toString();
            console.log(`Message received from ${queue}:`, messageContent); // debugging lol
    
            // Call the provided callback to process the message
            callback(JSON.parse(messageContent));
    
            // Acknowledge the message
            channel.ack(msg);
            }
        });
      }
      
      console.log(`Listening for messages on ${queue}...`);
    } catch (error) {
      console.error(`Error receiving messages from ${queue}:`, error);
    }
}

async function reduceProductStock(msg) {
    const connectionSql = await db.getConnection();
    await connectionSql.query(
        'UPDATE items SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
        [msg.quantity, msg.itemId]
    );
    console.log('berhasil update stock barang untuk id barang: ', msg.itemId); // debugging lol
}

// Function to initialize RabbitMQ and then start listening for messages
async function startRabbitMQListeners() {
    try {
      await initRabbitMQ(); // Ensure RabbitMQ is initialized before proceeding
  
      receiveMessage(productQueue,reduceProductStock);
      console.log(`[RabbitMQ] product services mendengarkan channel/queue products`); // Debugging message
    
  
    } catch (error) {
      console.error('Error during RabbitMQ setup or listener initialization:', error);
    }
  }
  
// Call the function to start RabbitMQ and listeners
startRabbitMQListeners();  

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

// Jalankan server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});
