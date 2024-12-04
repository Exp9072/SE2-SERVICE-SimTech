const express = require('express');
const amqp = require('amqplib');

const app = express();

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

    console.log('RabbitMQ connection established');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    process.exit(1); // Exit process if RabbitMQ connection fails
  }
}

// Initialize RabbitMQ when the server starts
initRabbitMQ();



app.get('/api/orders', (req, res) => {
  res.send("order service working");
});

app.post('/api/orders', (req, res) => {
  // 1. buat order baru dengan status belum dibayar
  // 2. tunggu message dari service payment untuk
  //    mengganti status order jadi sudah terbayar.
  // 3. kirim message ke service product untuk update 
  //    stock.

  // message kemungkinan berisikan 'id' dari order tersebut
});

// TODO
// 1. buat fungsi (async kemungkinan) untuk ganti status order
//    param: orderId 
// 2. buat rabbitmq listener dengan didalam nya switch case
//    message yang dikirm/ diterima kemungkinan berbentuk JSON
//    dengan isi tipe_message dan orderId


// Jalankan server
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});
