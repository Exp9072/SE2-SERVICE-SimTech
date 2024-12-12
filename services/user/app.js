const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');
const mysql = require('mysql2/promise');
const fetch = require('node-fetch'); // Tambahkan untuk customFetch
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.set('trust proxy', true); // Percayai proksi pertama (ngrok)
app.use(
    session({
        secret: 'simtech-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        },
    })
);

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
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('GitHub profile:', profile);
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
                console.error('GitHub auth error:', error);
                return done(error, null);
            }
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    console.log('Serialize User:', user); // Debugging
    done(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture,
    });
});

passport.deserializeUser(async (user, done) => {
    console.log('Deserialize User:', user); // Debugging

    try {
        // Ambil hanya ID dari parameter
        const { id } = user;

        // Perbaiki query untuk hanya mengambil berdasarkan ID
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Deserialized User:', user); // Debugging
            done(null, user);
        } else {
            console.log('User not found in database');
            done(null, null);
        }
    } catch (error) {
        console.error('Error in deserialize:', error);
        done(error, null);
    }
});


// Middleware untuk memeriksa header tambahan
app.use((req, res, next) => {
    const userId = req.headers['user-id'];
    const userEmail = req.headers['user-email'];

    if (userId) {
        console.log('Header User ID:', userId); // Debugging
    }
    if (userEmail) {
        console.log('Header User Email:', userEmail); // Debugging
    }

    next();
});

// Variabel global untuk menyimpan data login Google
const LOGIN_GOOGLE = [];

// Wrapper untuk fetch dengan header tambahan
async function customFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
}

// Endpoint to get authenticated user
app.get('/auth/user', async (req, res) => {
    try {
        console.log('Auth check - Session:', req.session);
        console.log('Auth check - User:', req.user);

        // Check LOGIN_GOOGLE array first
        if (LOGIN_GOOGLE.length > 0) {
            const latestUser = LOGIN_GOOGLE[LOGIN_GOOGLE.length - 1];
            // Update session if not set
            if (!req.session.user) {
                req.session.user = latestUser;
            }
            return res.json({
                success: true,
                user: latestUser
            });
        }

        // Check session
        if (req.session.user) {
            return res.json({
                success: true,
                user: req.session.user
            });
        }

        // Check JWT token
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // Get full user data from database
                const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
                if (users.length > 0) {
                    const user = users[0];
                    const userData = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name,
                        profilePicture: user.profile_picture
                    };
                    // Update session
                    req.session.user = userData;
                    return res.json({
                        success: true,
                        user: userData
                    });
                }
            } catch (error) {
                console.error('JWT verification failed:', error);
            }
        }

        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized' 
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});


// Google OAuth Endpoint
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Endpoint
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            console.log('Google Authentication Successful:', req.user);
            
            const userData = {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                role: req.user.role,
                profilePicture: req.user.profile_picture
            };

            // Set session data
            req.session.user = userData;

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: req.user.id, 
                    email: req.user.email, 
                    role: req.user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Save to LOGIN_GOOGLE array
            LOGIN_GOOGLE.push(userData);

            console.log('Session after Google Login:', req.session);
            console.log('LOGIN_GOOGLE:', LOGIN_GOOGLE);
            
            // Redirect with token
            res.redirect(`http://192.168.0.5:8080?token=${token}`);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect('/');
        }
    }
);

// Endpoint untuk mengirim data LOGIN_GOOGLE ke frontend
app.get('/auth/google/data', (req, res) => {
    res.json(LOGIN_GOOGLE);
});

// GitHub OAuth Endpoint
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback Endpoint
app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: 'https://83f7-182-2-166-159.ngrok-free.app/login',
        failureMessage: true,
        session: true
    }),
    async (req, res) => {
        try {
            console.log('GitHub callback reached', {
                user: req.user,
                session: req.session,
                isAuthenticated: req.isAuthenticated()
            });
            
            if (!req.user) {
                console.log('No user found in request');
                return res.redirect('https://83f7-182-2-166-159.ngrok-free.app/login?error=auth_failed');
            }

            const userData = {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                profilePicture: req.user.profile_picture,
                role: req.user.role
            };

            // Store in LOGIN_GOOGLE array (we'll use this for both Google and GitHub)
            LOGIN_GOOGLE.push(userData);

            // Store user data in session
            req.session.user = userData;

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: req.user.id, 
                    email: req.user.email, 
                    role: req.user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('Session saved with user:', req.session.user);
            
            // Redirect with token
            res.redirect(`http://192.168.0.5:8080?token=${token}`);
        } catch (error) {
            console.error('GitHub callback error:', error);
            res.redirect('https://83f7-182-2-166-159.ngrok-free.app/login?error=auth_failed');
        }
    }
);

// Add a route to check session
app.get('/check-session', (req, res) => {
    console.log('Checking session:', {
        session: req.session,
        user: req.session.user,
        isAuthenticated: req.isAuthenticated()
    });
    res.json({
        authenticated: req.isAuthenticated(),
        user: req.session.user
    });
});

// Endpoint Logout
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }

        // Hapus sesi
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Session destruction failed' });
            }

            // Kosongkan LOGIN_GOOGLE
            LOGIN_GOOGLE.length = 0;

            // Hapus cookie sesi di browser
            res.clearCookie('connect.sid', { path: '/' });

            console.log('User logged out successfully');
            console.log('LOGIN_GOOGLE cleared:', LOGIN_GOOGLE); // Debugging untuk memastikan kosong
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

// Endpoint Login with email/password
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

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePicture: user.profile_picture
        };

        // Store in LOGIN_GOOGLE array (we'll use this for all auth methods)
        LOGIN_GOOGLE.push(userData);

        // Store user data in session
        req.session.user = userData;

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Use req.login to set up Passport session
        req.login(userData, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ success: false, message: 'Session initialization failed' });
            }

            console.log('Session data set and req.user initialized:', req.user);
            res.json({
                success: true,
                message: 'Login successful',
                user: userData,
                token: token
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
}

// Jalankan User Service
app.listen(3001, () => console.log('User service running on port 3001'));
