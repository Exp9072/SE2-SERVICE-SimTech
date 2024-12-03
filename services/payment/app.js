const express = require('express');
const amqp = require('amqplib');

const app = express();

// RabbitMQ connection variables
const amqpUrl = 'amqp://localhost';
const paymentQueue = 'payments'; // Queue name to send messages to
const orderQueue = 'orders';

let connection, paymentChannel, orderChannel;

// Function to initialize RabbitMQ connection and channel
async function initRabbitMQ() {
  try {
    // Create a single RabbitMQ connection 
    connection = await amqp.connect(amqpUrl);

    // make both channel
    paymentChannel = await connection.createChannel();
    orderChannel = await connection.createChannel();

    // Assert queue (ensure it exists)
    await paymentChannel.assertQueue(paymentQueue, { durable: false });
    await orderChannel.assertQueue(orderQueue, { durable: false });

    console.log('RabbitMQ connection established');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit process if RabbitMQ connection fails
  }
}

// Initialize RabbitMQ when the server starts
initRabbitMQ();

app.get('/api/payments', (req, res) => {
  res.send("payment service working");
});

app.post('/api/payments', (req, res) => {
  // post ke endpoint ini kemungkinan butuh id dari order
  
  // jadi di aplikasi ketika bikin order, bakal pindah ke payment 
  // di payment kalo berhasil baru ngirim message ke order


  // 1. lakukan paymment
  // 2. ketika sukses, kirim message ke service order 


});

// Jalankan server
const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
});
