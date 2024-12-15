const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Ensure JWT_SECRET is available
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set!');
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(morgan('dev'));

// Middleware Autentikasi JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log('Auth check - Headers:', {
        authorization: req.headers.authorization,
        token: token ? 'present' : 'missing'
    });
    
    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('Decoded token:', decoded);
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(403).json({ message: 'Token tidak valid' });
    }
};

// Middleware untuk memeriksa role admin
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
};

// Konfigurasi HTTPS
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'serverkey', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'servercrt', 'server.crt'))
};

// Melindungi rute yang membutuhkan autentikasi
app.use('/api/admin/*', authenticateAdmin);
app.use('/api/inventory/*', authenticateAdmin);

// Sajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// Handle JWT errors before routes
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ 
            message: 'Token tidak valid atau tidak ditemukan' 
        });
    }
    next(err);
});

// **1. Pembatas Rate Global**
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 2000, // Increased from 1000 to 2000
    message: {
        status: 429,
        message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// **2. Pembatasan per IP**
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
        requestTimes[clientIp] = now;
        next();
    };
};

// Middleware untuk pembatasan per IP
const ipThrottle = throttle(200); // Reduced from 600ms to 200ms

// **3. Pembatasan user**
const userThrottle = throttle(100);
const userLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 3000, // Increased from 2000 to 3000
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

// Handle auth routes
app.use('/auth/login', proxy('http://user-service:3001', {
    proxyReqPathResolver: (req) => '/auth/login',
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            console.log('Login response:', data);
            return JSON.stringify(data);
        } catch (error) {
            console.error('Error parsing login response:', error);
            return proxyResData;
        }
    },
    onError: (err, req, res) => {
        console.error('Auth proxy error:', err);
        res.status(500).json({ 
            message: 'Error processing authentication request',
            error: err.message 
        });
    }
}));

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

// Middleware to check auth for protected routes
const checkAuth = async (req, res, next) => {
    const token = req.query.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const response = await fetch('http://user-service:3001/auth/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!data.success || !data.user) {
            return res.redirect('/login');
        }

        // For admin-only routes, check role
        if (req.adminOnly && data.user.role !== 'admin') {
            return res.redirect('/');
        }

        req.user = data.user;
        next();
    } catch (error) {
        console.error('Auth check error:', error);
        res.redirect('/login');
    }
};

// Protected route for inventaris (admin only)
app.get('/inventaris', (req, res, next) => {
    req.adminOnly = true;
    next();
}, checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inventaris.html'));
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
    proxyReqPathResolver: () => `${process.env.NGROK_URL}/auth/google`,
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
    proxyReqPathResolver: () => `${process.env.NGROK_URL}/auth/google/callback`,
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
app.use('/auth/github', proxy('https://5081-182-3-43-40.ngrok-free.app', {
    proxyReqPathResolver: () => `${process.env.NGROK_URL}/auth/github`,
    https: true,
    userResDecorator: (proxyRes, proxyResData, req, res) => {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        return proxyResData;
    },
}));

app.use('/auth/github/callback', proxy('https://5081-182-3-43-40.ngrok-free.app', {
    proxyReqPathResolver: () => `${process.env.NGROK_URL}/auth/github/callback`,
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

// Handle specific order routes first
app.use('/api/orders/:orderId/status', proxy('http://order-service:3003', {
    proxyReqPathResolver: (req) => {
        const path = `/orders/${req.params.orderId}/status`;
        console.log('Proxying status update to:', path);
        return path;
    },
    changeOrigin: true,
    secure: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        if (!userId) {
            throw new Error('Missing user-id header');
        }
        proxyReqOpts.headers['user-id'] = userId;
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ message: 'Error proxying request' });
    }
}));

// Menangani rute pesanan umum
app.use('/api/orders', proxy('http://order-service:3003', {
    proxyReqPathResolver: (req) => {
        console.log('Order request path:', req.path);
        console.log('Original URL:', req.originalUrl);
        console.log('Method:', req.method);
        
        // Handle cart orders
        if (req.path === '/cart') {
            console.log('Handling cart order');
            return '/orders/create';
        }
        
        // Handle GET request for fetching user orders
        if (req.method === 'GET' && req.path === '/') {
            return '/orders/user';
        }
        
        // Handle status updates
        if (req.path.includes('/status')) {
            const orderId = req.path.split('/')[1];
            return `/orders/${orderId}/status`;
        }
        
        // Handle POST request for creating new order
        if (req.method === 'POST' && req.path === '/') {
            return '/orders/create';
        }
        
        return req.originalUrl.replace('/api/orders', '/orders');
    },
    changeOrigin: true,
    secure: false,
    proxyReqOptDecorator: async (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        const userEmail = srcReq.headers['user-email'];
        
        if (!userId) {
            throw new Error('Header user-id tidak ditemukan');
        }
        
        // Require email for all order operations
        if (!userEmail) {
            throw new Error('Header user-email tidak ditemukan');
        }
        
        proxyReqOpts.headers['user-id'] = userId;
        proxyReqOpts.headers['user-email'] = userEmail;
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        
        console.log('Final request headers:', proxyReqOpts.headers);
        console.log('Final request path:', proxyReqOpts.path);
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ message: err.message || 'Error proxying request' });
    }
}));

app.use('/api/payments', proxy('http://payment-service:3004', {
    secure: false,
    changeOrigin: true,
    proxyReqPathResolver: (req) => {
        // Keep the original path
        return req.originalUrl;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        const userEmail = srcReq.headers['user-email'];
        if (!userId) {
            throw new Error('Missing user-id header. User must be authenticated.');
        }
        if (!userEmail) {
            throw new Error('Missing user-email header. User must be authenticated.');
        }
        proxyReqOpts.headers['user-id'] = userId;
        proxyReqOpts.headers['user-email'] = userEmail;
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        
        // Log the request details
        console.log('Payment request headers:', proxyReqOpts.headers);
        console.log('Payment request body:', srcReq.body);
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.error('Payment proxy error:', err);
        res.status(500).json({ message: err.message || 'Error processing payment request' });
    }
}));

// Middleware untuk meneruskan permintaan ke service pesanan
app.use('/api/admin/orders', proxy('http://order-service:3003', {
    changeOrigin: true,
    proxyReqPathResolver: (req) => {
        // Forward all query parameters
        const queryString = new URLSearchParams(req.query).toString();
        return `/api/admin/orders${queryString ? `?${queryString}` : ''}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const userId = srcReq.headers['user-id'];
        console.log('user-id: ', userId);
        if (userId) {
            proxyReqOpts.headers['user-id'] = userId;
            // Meneruskan token JWT
            if (srcReq.headers.authorization) {
                proxyReqOpts.headers['authorization'] = srcReq.headers.authorization;
            }
        }
        return proxyReqOpts;
    },
    onError: (err, req, res) => {
        console.log('error gateway onError');
        console.error('Error proxying request:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada Gateway.' });
    }
}));

app.use('/api/inventory', proxy('http://product-service:3002', {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        
        // Get token from either header or query
        const token = srcReq.headers.authorization?.split(' ')[1] || srcReq.query?.token;
        
        if (!token) {
            throw new Error('Missing authorization token');
        }

        try {
            // Verify and decode token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Set both headers
            proxyReqOpts.headers['authorization'] = `Bearer ${token}`;
            proxyReqOpts.headers['user-id'] = decoded.id;
            
            // Ensure admin role for inventory access
            if (decoded.role !== 'admin') {
                throw new Error('Admin access required');
            }
            
            return proxyReqOpts;
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error(error.message);
        }
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        if (proxyRes.statusCode === 401 || proxyRes.statusCode === 403) {
            userRes.status(proxyRes.statusCode);
            return JSON.stringify({ message: 'Unauthorized access' });
        }
        return proxyResData;
    },
    onError: (err, req, res) => {
        console.error('Inventory proxy error:', err);
        if (err.message.includes('Admin access required')) {
            res.status(403).json({ message: 'Admin access required' });
        } else if (err.message.includes('token')) {
            res.status(401).json({ message: 'Authentication required' });
        } else {
            res.status(500).json({ 
                message: 'Error processing inventory request',
                error: err.message
            });
        }
    }
}));

// Proxy for inventory stats
app.use('/api/inventory/stats', proxy('http://inventory-service:3002', {
    proxyReqPathResolver: () => '/api/inventory/stats',
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        if (srcReq.headers.authorization || srcReq.query?.token) {
            proxyReqOpts.headers['authorization'] = srcReq.headers.authorization || `Bearer ${srcReq.query.token}`;
        }
        if (srcReq.headers['user-id']) {
            proxyReqOpts.headers['user-id'] = srcReq.headers['user-id'];
        } else if (srcReq.query?.token) {
            // Extract user ID from JWT token
            const token = srcReq.query.token;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                proxyReqOpts.headers['user-id'] = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return proxyReqOpts;
    }
}));

// Proxy for inventory history
app.use('/api/inventory/history', proxy('http://inventory-service:3002', {
    proxyReqPathResolver: () => '/api/inventory/history',
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        if (srcReq.headers.authorization || srcReq.query?.token) {
            proxyReqOpts.headers['authorization'] = srcReq.headers.authorization || `Bearer ${srcReq.query.token}`;
        }
        if (srcReq.headers['user-id']) {
            proxyReqOpts.headers['user-id'] = srcReq.headers['user-id'];
        } else if (srcReq.query?.token) {
            // Extract user ID from JWT token
            const token = srcReq.query.token;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                proxyReqOpts.headers['user-id'] = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return proxyReqOpts;
    }
}));

// Proxy for inventory
app.use('/api/inventory', proxy('http://inventory-service:3002', {
    proxyReqPathResolver: (req) => `/api/inventory${req.url}`,
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        if (srcReq.headers.authorization || srcReq.query?.token) {
            proxyReqOpts.headers['authorization'] = srcReq.headers.authorization || `Bearer ${srcReq.query.token}`;
        }
        if (srcReq.headers['user-id']) {
            proxyReqOpts.headers['user-id'] = srcReq.headers['user-id'];
        } else if (srcReq.query?.token) {
            // Extract user ID from JWT token
            const token = srcReq.query.token;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                proxyReqOpts.headers['user-id'] = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return proxyReqOpts;
    }
}));

// Proxy for admin orders
app.use('/api/admin/orders', proxy('http://order-service:3003', {
    proxyReqPathResolver: (req) => `/api/admin/orders${req.url}`,
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        if (srcReq.headers.authorization || srcReq.query?.token) {
            proxyReqOpts.headers['authorization'] = srcReq.headers.authorization || `Bearer ${srcReq.query.token}`;
        }
        if (srcReq.headers['user-id']) {
            proxyReqOpts.headers['user-id'] = srcReq.headers['user-id'];
        } else if (srcReq.query?.token) {
            // Extract user ID from JWT token
            const token = srcReq.query.token;
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                proxyReqOpts.headers['user-id'] = decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return proxyReqOpts;
    }
}));

// Add these lines to protect more routes
app.use('/api/orders/*', authenticateJWT);      // Protect order routes
app.use('/api/payments/*', authenticateJWT);    // Protect payment routes
app.use('/api/user/*', authenticateJWT);        // Protect user routes

// Create HTTPS server
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;
https.createServer(httpsOptions, app)
    .listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log(`Gateway running on https://${process.env.APP_IP}:${HTTPS_PORT}`);
    });

// Optional: Redirect HTTP to HTTPS
const http = require('http');
const HTTP_PORT = process.env.HTTP_PORT || 8080;
http.createServer((req, res) => {
    const appIP = process.env.APP_IP || req.headers.host.split(':')[0];
    const httpsPort = process.env.HTTPS_PORT || 8443;
    res.writeHead(301, { 
        "Location": `https://${appIP}:${httpsPort}${req.url}`
    });
    res.end();
}).listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`HTTP redirect server running on port ${HTTP_PORT}`);
    console.log(`Redirecting to https://${process.env.APP_IP}:${process.env.HTTPS_PORT}`);
});

// Add this endpoint to serve configuration to frontend
app.get('/config', (req, res) => {
    res.json({
        APP_IP: process.env.APP_IP,
        APP_PORT: process.env.APP_PORT,
        NGROK_URL: process.env.NGROK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL
    });
});
