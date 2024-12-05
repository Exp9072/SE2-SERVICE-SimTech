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
    ost: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
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

// fungsionalitas rabbit mq
// RabbitMQ connection variables
const amqpUrl = 'amqp://localhost';
const paymentQueue = 'payments'; // Queue name to send messages to

let connection, paymentChannel;

// Function to initialize RabbitMQ connection and channel
async function initRabbitMQ() {
  try {
    // Create a single RabbitMQ connection 
    connection = await amqp.connect(amqpUrl);

    // make channel
    paymentChannel = await connection.createChannel();

    // Assert queue (ensure it exists)
    await paymentChannel.assertQueue(paymentQueue, { durable: false });

    console.log('RabbitMQ connection established');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit process if RabbitMQ connection fails
  }
}

// Initialize RabbitMQ when the server starts
initRabbitMQ();

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
  

// Endpoint untuk melakukan pembayaran
app.post('/api/payments', authenticateUser, async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
        console.error('Invalid payment request:', req.body); // Debugging
        return res.status(400).json({ message: 'Order ID dan metode pembayaran diperlukan.' });
    }

    try {
        console.log(`Processing payment for order ID: ${orderId}, Payment Method: ${paymentMethod}`); // Debugging
        
        // Periksa apakah pesanan ada dan belum dibayar
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND email = ? AND payment = "unpaid"',
            [orderId, req.userEmail]
        );

        if (order.length === 0) {
            console.error('Order not found or already paid:', orderId); // Debugging
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibayar.' });
        }
        

        // ini gw komen, cek kode dibawah beserta komen dan file order/app.js
        // Update status pembayaran dan pesanan
        // await db.query(
        //     'UPDATE orders SET payment = ?, status = "sedang dikirim" WHERE order_id = ?',
        //     ['paid', orderId]
        // );

        // disini rabbitmq mengirim message ke channel 'payments'
        // dan service order mendengarkan channel tersebut.
        // yang merubah status order menjadi 'paid' dan 'sedang dikirim' adalah
        // service order dengan fungsi async changeOrderStatus().
        // message berisikan orderId tersebut.
        const message = {orderId};
        sendMessage(paymentQueue, message)

        // Simpan record pembayaran di tabel payments
        await db.query(
            'INSERT INTO payments (order_id, email, payment_method, amount) VALUES (?, ?, ?, ?)',
            [orderId, req.userEmail, paymentMethod, order[0].total_price]
        );

        console.log(`Payment successful for order ID: ${orderId}`); // Debugging
        res.status(200).json({ message: 'Pembayaran berhasil.', orderId });
    } catch (error) {
        console.error('Error processing payment:', error); // Debugging
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





// Jalankan Payment Service
const PORT = process.env.PAYMENT_SERVICE_PORT || 3004;
app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
