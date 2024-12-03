const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(express.json());
app.use(session({ secret: 'simtech-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'simtech',
});

// Debugging Environment Variables
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL);

// Passport Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const profilePicture = profile.photos?.[0]?.value || null;

            try {
                const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                if (rows.length === 0) {
                    const result = await db.query(
                        'INSERT INTO users (name, email, role, oauth_provider, oauth_id, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
                        [profile.displayName, email, 'user', 'google', profile.id, profilePicture]
                    );
                    const newUser = { id: result[0].insertId, name: profile.displayName, email, profilePicture };
                    return done(null, newUser);
                }
                const user = { ...rows[0], profile_picture: rows[0].profile_picture || profilePicture };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Passport GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.username;
            const profilePicture = profile.photos?.[0]?.value || null;

            try {
                const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                if (rows.length === 0) {
                    const result = await db.query(
                        'INSERT INTO users (name, email, role, oauth_provider, oauth_id, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
                        [profile.displayName || profile.username, email, 'user', 'github', profile.id, profilePicture]
                    );
                    const newUser = { id: result[0].insertId, name: profile.displayName || profile.username, email, profilePicture };
                    return done(null, newUser);
                }
                const user = { ...rows[0], profile_picture: rows[0].profile_picture || profilePicture };
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length > 0) {
            const user = rows[0];
            done(null, user);
        } else {
            done(null, null);
        }
    } catch (error) {
        done(error, null);
    }
});

// Endpoint to get authenticated user
app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated() && req.user) {
        res.json({
            success: true,
            user: {
                name: req.user.name || 'User',
                email: req.user.email,
                profilePicture: req.user.profile_picture || '/default-profile.png',
            },
        });
    } else {
        res.json({ success: false, user: null });
    }
});

// Google OAuth Endpoint
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Endpoint
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000/');
    }
);

// GitHub OAuth Endpoint
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback Endpoint
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:3000/');
    }
);

// Endpoint Logout
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Session destruction failed' });
            }
            res.clearCookie('connect.sid'); // Hapus cookie sesi jika ada
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});

// Endpoint Register
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Periksa apakah email sudah terdaftar
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Simpan pengguna baru
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, 'user']
        );

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Endpoint Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Jika password tidak di-hash, langsung bandingkan
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Login berhasil
        req.session.userId = user.id; // Simpan sesi pengguna
        res.json({ success: true, message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});



// Jalankan User Service
app.listen(3001, () => console.log('User service running on port 3001'));
