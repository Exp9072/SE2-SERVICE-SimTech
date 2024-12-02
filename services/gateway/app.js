const express = require('express');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(morgan('dev'));

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

// Proxy untuk Google OAuth
app.use('/auth/google', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/google',
}));

app.use('/auth/google/callback', proxy('http://localhost:3001', {
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
app.use('/auth/github', proxy('http://localhost:3001', {
    proxyReqPathResolver: () => '/auth/github',
}));

app.use('/auth/github/callback', proxy('http://localhost:3001', {
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


// Jalankan Gateway
app.listen(3000, () => console.log('Gateway running on port 3000'));
