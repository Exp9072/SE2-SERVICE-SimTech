const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(express.json());
app.use(session({ secret: 'simtech-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Dummy Database
const users = [
    { id: 1, email: 'user@example.com', password: null },
];

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
        (accessToken, refreshToken, profile, done) => {
            console.log('Google Profile:', profile);
            const user = users.find((u) => u.email === profile.emails[0].value);
            if (!user) {
                const newUser = { id: users.length + 1, email: profile.emails[0].value, password: null };
                users.push(newUser);
                return done(null, newUser);
            }
            done(null, user);
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
        (accessToken, refreshToken, profile, done) => {
            console.log('GitHub Profile:', profile);
            const user = users.find((u) => u.email === profile.username);
            if (!user) {
                const newUser = { id: users.length + 1, email: profile.username, password: null };
                users.push(newUser);
                return done(null, newUser);
            }
            done(null, user);
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id); // Simpan ID user ke session
});

passport.deserializeUser((id, done) => {
    console.log('Deserializing user ID:', id);
    const user = users.find((u) => u.id === id);
    console.log('Deserialized user:', user);
    done(null, user); // Ambil user dari session
});

// Google OAuth Endpoint
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Endpoint
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('Google OAuth callback successful');
        console.log('Authenticated User:', req.user);
        console.log('Redirecting to http://localhost:3000/');
        res.redirect('http://localhost:3000/'); // Redirect ke homepage Gateway
    }
);


// GitHub OAuth Endpoint
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth Callback Endpoint
app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        console.log('GitHub OAuth callback successful');
        console.log('Authenticated User:', req.user);
        console.log('Redirecting to http://localhost:3000/');
        res.redirect('http://localhost:3000/'); // Redirect ke homepage Gateway
    }
);


// Halaman Sukses
app.get('/success', (req, res) => {
    res.send('Login successful! Welcome to SimTech.');
});

// Jalankan User Service
app.listen(3001, () => console.log('User service running on port 3001'));
