const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const amqp = require('amqplib');

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

// fungsionalitas rabbit mq
// RabbitMQ connection variables
const amqpUrl = 'amqp://localhost';
const paymentQueue = 'payments'; // Queue name to send messages to
const productQueue = 'products';

let connection, paymentChannel, productChannel;

// Function to initialize RabbitMQ connection and channel
async function initRabbitMQ() {
  try {
    // Create a single RabbitMQ connection 
    connection = await amqp.connect(amqpUrl);

    // make both channel
    paymentChannel = await connection.createChannel();
    productChannel = await connection.createChannel();

    // Assert queue (ensure it exists)
    await paymentChannel.assertQueue(paymentQueue, { durable: false });
    await productChannel.assertQueue(productQueue, { durable: false });

    console.log('inside initrabbitmq(), payment channel is alive? ', paymentChannel !== undefined);
    

    console.log('RabbitMQ connection established');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit process if RabbitMQ connection fails
  }
}

/**
 * Sends a message to a RabbitMQ queue.
 * @param {string} queue - The name of the queue to send the message to.
 * @param {object|string} message - The message to send. It will be serialized to JSON if an object.
 */
async function sendMessage(queue, message) {
    try {
      // Serialize the message to JSON if it's an object
      const messageToSend = typeof message === 'object' ? JSON.stringify(message) : message;
  
      // Choose the appropriate channel
      const channel = queue === paymentQueue ? paymentChannel : productChannel;
  
      // Send the message to the queue
      channel.sendToQueue(queue, Buffer.from(messageToSend));
  
      console.log(`Message sent to ${queue}:`, messageToSend);
    } catch (error) {
      console.error(`Error sending message to ${queue}:`, error);
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
      const channel = queue === paymentQueue ? paymentChannel : productChannel;
        console.log('listening for queue: ', queue); // debugging juga
        console.log('channel is alive? ', channel !== undefined); // debugging juga
        
        
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

async function changeOrderStatus(msg) {
    await db.query(
        'UPDATE orders SET payment = ?, status = "sedang dikirim" WHERE order_id = ?',
        ['paid', msg.orderId]
    );
    console.log("berhasil ganti status jadi paid"); // debugging lol
}

// Function to initialize RabbitMQ and then start listening for messages
async function startRabbitMQListeners() {
    try {
      await initRabbitMQ(); // Ensure RabbitMQ is initialized before proceeding
  
      receiveMessage(paymentQueue, changeOrderStatus);
      console.log(`[RabbitMQ] order services mendengarkan channel/queue payments`); // Debugging message
    
  
    } catch (error) {
      console.error('Error during RabbitMQ setup or listener initialization:', error);
    }
  }
  
// Call the function to start RabbitMQ and listeners
startRabbitMQListeners();  

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

            // gw komen, cek kode dan komen dibawahnya
            // Kurangi stok barang
            // await connection.query(
            //     'UPDATE items SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
            //     [item.quantity, item.item_id]
            // );

            // disini rabbitmq mengirim message ke channel 'products'
            // dan service product mendengarkan channel tersebut.
            // yang mengurangi stock produk adalah
            // service product dengan fungsi async reduceProductStock().
            // message berisikan quantity dan id produk tersebut.
            const message = {
              quantity: item.quantity, 
              itemId: item.item_id
            };
            sendMessage(productQueue, message)
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



// Jalankan Order Service
const PORT = process.env.ORDER_SERVICE_PORT || 3003;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
