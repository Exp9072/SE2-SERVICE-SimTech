const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(morgan('dev'));

// HTTPS Configuration
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'serverkey', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'servercrt', 'server.crt'))
};

// Sajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// **1. Rate Limiter Global**
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 1000, // Maksimal 300 permintaan per IP dalam 15 menit
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// **2. Throttle per IP**
const throttle = (delay) => {
    const requestTimes = {}; // Penyimpanan sementara untuk IP
    return (req, res, next) => {
        const clientIp = req.ip;
        const now = Date.now();

        if (requestTimes[clientIp] && now - requestTimes[clientIp] < delay) {
            return res.status(429).json({
                status: 429,
                message: 'Terlalu banyak permintaan dalam waktu singkat. Silakan coba lagi.',
            });
        }
        requestTimes[clientIp] = now; // Perbarui waktu terakhir untuk IP ini
        next();
    };
};

// Middleware untuk throttle per IP
const ipThrottle = throttle(600); // Batasan per IP (600ms antar permintaan)

// **3. Throttle product**
const productThrottle = throttle(50); // Batasan lebih longgar untuk produk
const productLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10000, // Maksimal 10000 permintaan per IP dalam 15 menit
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// **3. Throttle user**
const userThrottle = throttle(100); // Batasan lebih longgar untuk produk
const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 2000, // Maksimal 2000 permintaan per IP dalam 15 menit
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware global hanya untuk API tertentu
app.use(['/auth', '/api/orders', '/api/payments'], globalLimiter);
app.use(['/api/orders', '/api/payments'], ipThrottle);

// Middleware khusus untuk rute produk
//app.use('/api/products', productLimiter, productThrottle);
app.use('/auth/user', userLimiter, userThrottle);

// Rute utama untuk Gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sajikan halaman login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pembayaran.html'));
});

app.get('/katalog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'katalog.html'));
});

app.get('/pc-ready', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'PcReady.html'));
});

app.get('/simulasi', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'simulasi.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Proxy untuk Logout
app.use('/logout', proxy('http://user-service:3001', {
    proxyReqPathResolver: () => '/logout',
    secure: false,
    changeOrigin: true
}));

// Proxy untuk Register
app.use('/register', proxy('http://user-service:3001', {
    proxyReqPathResolver: () => '/register',
    secure: false,
    changeOrigin: true
}));

// Proxy untuk Google OAuth
app.use('/auth/google', proxy('https://cef1-139-194-77-206.ngrok-free.app', {
    proxyReqPathResolver: () => 'https://cef1-139-194-77-206.ngrok-free.app/auth/google',
    https: true,
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        return proxyResData;
    },
}));

app.use('/auth/google/callback', proxy('https://cef1-139-194-77-206.ngrok-free.app', {
    proxyReqPathResolver: () => 'https://cef1-139-194-77-206.ngrok-free.app/auth/google/callback',
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        console.log('Response Headers from User Service:', proxyRes.headers);
        const redirectLocation = proxyRes.headers['location'];
        if (proxyRes.statusCode === 302 && redirectLocation) {
            res.redirect(redirectLocation);
            return;
        }
        return proxyResData;
    },
}));

// Proxy untuk GitHub OAuth
app.use('/auth/github', proxy('https://cef1-139-194-77-206.ngrok-free.app', {
    proxyReqPathResolver: () => 'https://cef1-139-194-77-206.ngrok-free.app/auth/github',
    https: true,
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        return proxyResData;
    },
}));

app.use('/auth/github/callback', proxy('https://cef1-139-194-77-206.ngrok-free.app', {
    proxyReqPathResolver: () => 'https://cef1-139-194-77-206.ngrok-free.app/auth/github/callback',
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        const redirectLocation = proxyRes.headers['location'];
        if (proxyRes.statusCode === 302 && redirectLocation) {
            res.redirect(redirectLocation);
            return;
        }
        return proxyResData;
    }
}));

app.use('/auth/user', proxy('http://user-service:3001', {
    proxyReqPathResolver: () => '/auth/user',
    secure: false,
    changeOrigin: true,
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        return proxyResData;
    },
}));

app.use('/login', proxy('http://user-service:3001', {
    proxyReqPathResolver: (req) => req.originalUrl,
    secure: false,
    changeOrigin: true
}));

app.use('/api/products', proxy('http://product-service:3002', {
    secure: false,
    changeOrigin: true,
    proxyReqPathResolver: (req) => req.originalUrl,
}));

app.use('/api/orders', proxy('http://order-service:3003', {
    secure: false,
    changeOrigin: true,
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        if (!userId) {
            throw new Error('Missing user-id header. User must be authenticated.');
        }
        proxyReqOpts.headers['user-id'] = userId;
        return proxyReqOpts;
    },
}));

app.use('/api/payments', proxy('http://payment-service:3004', {
    secure: false,
    changeOrigin: true,
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        if (!userId) {
            throw new Error('Missing user-id header. User must be authenticated.');
        }
        proxyReqOpts.headers['user-id'] = userId;
        return proxyReqOpts;
    },
}));

app.use('/api/orders/cart', proxy('http://order-service:3003', {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId;
        }
        return proxyReqOpts;
    },
}));

// Middleware untuk meneruskan permintaan ke service pesanan berdasarkan orderId
app.use('/api/orders/:orderId/status', proxy('http://order-service:3003', {
    changeOrigin: true,  // Mengubah origin header untuk menghindari masalah CORS
    pathRewrite: (path, req) => {
        return path.replace('/api/orders', '/orders');  // Mengubah path untuk diteruskan ke endpoint yang sesuai di order-service
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];  // Menambahkan header user-id ke proxy request
        console.log('user-id: ',  userId);
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId;  // Meneruskan user-id ke request proxy
        }
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.log('error gateway onError');
        console.error('Error proxying request:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada Gateway.' });
    }
}));

// Middleware untuk meneruskan permintaan untuk menghapus pesanan berdasarkan orderId dan status "unpaid"
app.use('/api/orders/:orderId', proxy('http://order-service:3003', {
    changeOrigin: true,  // Mengubah origin header untuk menghindari masalah CORS
    pathRewrite: (path, req) => {
        return path.replace('/api/orders', '/orders');  // Mengubah path untuk diteruskan ke endpoint yang sesuai di order-service
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];  // Menambahkan header user-id ke proxy request
        console.log('user-id: ',  userId);
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId;  // Meneruskan user-id ke request proxy
        }
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.log('error gateway onError');
        console.error('Error proxying request:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada Gateway.' });
    }
}));

// Middleware untuk meneruskan permintaan ke service pesanan (get all orders, dengan atau tanpa filter payment)
app.use('/api/admin/orders', proxy('http://order-service:3003', {
    changeOrigin: true,  // Mengubah origin header untuk menghindari masalah CORS
    pathRewrite: (path, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`); // Mendapatkan query parameter
        const payment = url.searchParams.get('payment'); // Ambil nilai query parameter "payment"

        // Jika ada filter payment, tambahkan query ke path yang diteruskan ke service order
        if (payment) {
            return `/orders?payment=${payment}`;
        }
        return '/orders'; // Jika tidak ada filter payment, gunakan path tanpa query
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id']; // Mendapatkan user-id dari header
        console.log('user-id: ', userId);
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId; // Meneruskan user-id ke request proxy
        }
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.log('error gateway onError');
        console.error('Error proxying request:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada Gateway.' });
    }
}));

// Create HTTPS server
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
https.createServer(httpsOptions, app)
    .listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log(`Gateway running on https://192.168.0.5:${HTTPS_PORT}`);
    });

// Optional: Redirect HTTP to HTTPS
const http = require('http');
const HTTP_PORT = process.env.HTTP_PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(301, { 
        "Location": "https://192.168.0.5:8443" + req.url 
    });
    res.end();
}).listen(HTTP_PORT, '0.0.0.0');
