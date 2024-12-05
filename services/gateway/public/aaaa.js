const { connectRabbitMQ, getRabbitChannel } = require('./rabbitmq');

// Hubungkan RabbitMQ saat layanan mulai
connectRabbitMQ();

// Endpoint untuk melakukan pembayaran
app.post('/api/payments', async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
        return res.status(400).json({ message: 'Order ID dan metode pembayaran diperlukan.' });
    }

    try {
        const [order] = await db.query(
            'SELECT * FROM orders WHERE order_id = ? AND email = ? AND payment = "unpaid"',
            [orderId, req.headers['user-email']]
        );

        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan atau sudah dibayar.' });
        }

        await db.query(
            'UPDATE orders SET payment = ?, status = "sedang dikemas" WHERE order_id = ?',
            ['paid', orderId]
        );

        await db.query(
            'INSERT INTO payments (order_id, email, payment_method, amount) VALUES (?, ?, ?, ?)',
            [orderId, req.headers['user-email'], paymentMethod, order[0].total_price]
        );

        const paymentData = {
            orderId,
            paymentMethod,
            amount: order[0].total_price,
            paymentDate: new Date().toISOString(),
        };

        // Kirim pesan ke RabbitMQ
        const channel = getRabbitChannel();
        await channel.assertQueue('payment_queue');
        channel.sendToQueue('payment_queue', Buffer.from(JSON.stringify(paymentData)));

        console.log('Payment message sent to RabbitMQ:', paymentData);
        res.status(200).json({ message: 'Pembayaran berhasil.', paymentData });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memproses pembayaran.' });
    }
});
