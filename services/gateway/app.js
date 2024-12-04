const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(morgan('dev'));

// **1. Rate Limiter Global**
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 300, // Maksimal 300 permintaan per IP dalam 15 menit
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Terapkan Rate Limiter Global untuk semua rute
app.use(globalLimiter);

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

// **Gunakan Middleware Global + Throttle IP untuk Semua Endpoint**
app.use(ipThrottle);

// Sajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Proxy untuk Logout
app.use( '/logout',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/logout',
}));

// Proxy untuk Register
app.use('/register',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/register',
}));

// Proxy untuk Google OAuth
app.use('/auth/google',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/google',
}));

app.use('/auth/google/callback',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/google/callback',
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        console.log('Proxying Google OAuth callback response:', proxyRes.statusCode);
        console.log('Status code:', proxyres.statusCode);
        console.log('Response Header:', proxyRes.headers);
        const redirectLocation = proxyRes.headers['location']; // Ambil lokasi redirect
        if (proxyRes.statusCode === 302 && redirectLocation) {
            console.log('Redirecting to:', redirectLocation);
            res.redirect(redirectLocation); // Redirect pengguna
            return;
        }
        console.log('Redirecting gagal');
        return proxyResData; // Pastikan data tetap diteruskan
    },
}));


// Proxy untuk GitHub OAuth
app.use('/auth/github',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/github',
}));

app.use('/auth/github/callback',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/github/callback',
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        console.log('Proxying GitHub OAuth callback response:', proxyRes.statusCode);
        console.log('Status code:', proxyres.statusCode);
        console.log('Response Header:', proxyRes.headers);
        const redirectLocation = proxyRes.headers['location']; // Ambil lokasi redirect
        if (proxyRes.statusCode === 302 && redirectLocation) {
            console.log('Redirecting to:', redirectLocation);
            res.redirect(redirectLocation); // Redirect pengguna
            return;
        }
        return proxyResData; // Pastikan data tetap diteruskan
    },
}));

app.use('/auth/user',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/user',
}));

// Proxy untuk Login
app.use('/login',  proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/login',
}));

// Proxy untuk Product Service
app.use('/api/products',  proxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => req.originalUrl,
}));

// Proxy untuk Order Service
app.use('/api/orders',  proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id']; // Ambil user-id dari header permintaan
        if (!userId) {
            throw new Error('Missing user-id header. User must be authenticated.');
        }
        proxyReqOpts.headers['user-id'] = userId; // Teruskan user-id ke layanan Order
        return proxyReqOpts;
    },
}));

// Proxy untuk Payment Service
app.use('/api/payments',  proxy('http://localhost:3004', {
    proxyReqPathResolver: (req) => req.originalUrl, // Teruskan URL asli
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id']; // Ambil user-id dari header permintaan
        if (!userId) {
            throw new Error('Missing user-id header. User must be authenticated.');
        }
        proxyReqOpts.headers['user-id'] = userId; // Teruskan user-id ke layanan pembayaran
        return proxyReqOpts;
    },
}));


app.use('/api/orders',  proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => {
        return req.originalUrl;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId;
        }
        return proxyReqOpts;
    },
}));

// Jalankan Gateway
app.listen(3000, () => console.log('Gateway running on port 3000'));
