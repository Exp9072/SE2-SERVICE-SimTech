const amqp = require('amqplib');

let channel = null; // Channel yang dapat digunakan kembali di seluruh layanan

const connectRabbitMQ = async () => {
    let retries = 5; // Maksimal retry
    while (retries) {
        try {
            const connection = await amqp.connect('amqp://localhost');
            channel = await connection.createChannel();
            console.log('RabbitMQ connected and channel created.');
            return channel;
        } catch (error) {
            console.error(`RabbitMQ connection failed, retries left: ${retries - 1}`, error);
            retries -= 1;
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum mencoba lagi
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
