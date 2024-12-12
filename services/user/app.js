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
app.get('/auth/user', (req, res) => {
    console.log('Auth check - Session:', req.session);
    console.log('Auth check - User:', req.user);
    
    // First check JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.json({
                success: true,
                user: decoded
            });
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    // Fallback to session check
    if (req.session.user) {
        return res.json({
            success: true,
            user: req.session.user
        });
    }

    // Check LOGIN_GOOGLE array
    if (LOGIN_GOOGLE.length > 0) {
        const latestUser = LOGIN_GOOGLE[LOGIN_GOOGLE.length - 1];
        return res.json({
            success: true,
            user: latestUser
        });
    }

    res.json({ success: false, user: null });
});


// Google OAuth Endpoint
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Endpoint
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('Google Authentication Successful:', req.user); // Debugging
        console.log('Session after Google Login:', req.session); // Debugging sesi
        // Simpan data user ke variabel LOGIN_GOOGLE
        LOGIN_GOOGLE.push({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profilePicture: req.user.profile_picture,
            role: req.user.role
        });

        console.log('LOGIN_GOOGLE:', LOGIN_GOOGLE); // Debugging
        const userData = encodeURIComponent(JSON.stringify(req.user));
        res.redirect(`http://192.168.0.5:8080?user=${userData}`);
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
    (req, res) => {
        console.log('GitHub callback reached', {
            user: req.user,
            session: req.session,
            isAuthenticated: req.isAuthenticated()
        });
        
        if (!req.user) {
            console.log('No user found in request');
            return res.redirect('https://83f7-182-2-166-159.ngrok-free.app/login?error=auth_failed');
        }

        // Store in LOGIN_GOOGLE array (we'll use this for both Google and GitHub)
        LOGIN_GOOGLE.push({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profilePicture: req.user.profile_picture,
            role: req.user.role
        });

        // Store user data in session
        req.session.user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            profile_picture: req.user.profile_picture,
            role: req.user.role
        };
        
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect('https://9d17-139-194-77-206.ngrok-free.app/login?error=session_error');
            }
            console.log('Session saved with user:', req.session.user);
            console.log('Session saved successfully, redirecting to homepage');
            
            // Send user data in query params
            const userData = encodeURIComponent(JSON.stringify(req.session.user));
            res.redirect(`https://9d17-139-194-77-206.ngrok-free.app?user=${userData}`);
        });
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

// Endpoint Login
app.post('/login', async (req, res, next) => {
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

        // Simpan data ke sesi
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        // Gunakan req.login untuk mengatur req.user di Passport
        req.login(req.session.user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }

            console.log('Session data set and req.user initialized:', req.user); // Debugging
            res.json({
                success: true,
                message: 'Login successful',
                user: { id: user.id, email: user.email, name: user.name },
            });
        });
    } catch (error) {
        console.error('Login error:', error); // Debugging
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    process.exit(1);
}

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.log('User not found:', email);
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }
        
        const user = users[0];
        if (password !== user.password) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }
        
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
        
        console.log('Login successful for:', email, 'Role:', user.role);
        
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture
            },
            token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat login' });
    }
});

// Jalankan User Service
app.listen(3001, () => console.log('User service running on port 3001'));
