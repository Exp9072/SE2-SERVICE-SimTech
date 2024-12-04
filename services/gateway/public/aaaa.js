// Proxy untuk Logout
app.use(throttle(500), '/logout', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/logout',
}));

// Proxy untuk Register
app.use(throttle(500), '/register', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/register',
}));

// Proxy untuk Google OAuth
app.use(throttle(500), '/auth/google', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/google',
}));

app.use(throttle(500), '/auth/google/callback', proxy('http://localhost:3001', {
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
app.use(throttle(500), '/auth/github', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/github',
}));

app.use(throttle(500), '/auth/github/callback', proxy('http://localhost:3001', {
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

app.use(throttle(500), '/auth/user', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/user',
}));

// Proxy untuk Login
app.use(throttle(500), '/login', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/login',
}));

// Proxy untuk Product Service
app.use(throttle(500), '/api/products', proxy('http://localhost:3002', {
    proxyReqPathResolver: (req) => req.originalUrl,
}));

// Proxy untuk Order Service
app.use(throttle(500), '/api/orders', proxy('http://localhost:3003', {
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
app.use(throttle(500), '/api/payments', proxy('http://localhost:3004', {
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
