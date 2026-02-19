const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateToken } = require('../utils/helpers');
const { isGuest, isAuthenticated } = require('../middleware/auth');

// GET /auth/register
router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

// POST /auth/register
router.post('/register', isGuest, async (req, res) => {
    try {
        const { email, password, password_confirm, display_name } = req.body;

        // Validation
        if (!email || !password || !display_name) {
            req.session.error = 'All fields are required';
            return res.redirect('/auth/register');
        }

        if (password !== password_confirm) {
            req.session.error = 'Passwords do not match';
            return res.redirect('/auth/register');
        }

        if (password.length < 8) {
            req.session.error = 'Password must be at least 8 characters';
            return res.redirect('/auth/register');
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            req.session.error = 'An account with this email already exists';
            return res.redirect('/auth/register');
        }

        // Create user
        const user = await User.create({ email, password, display_name });

        // Send verification email
        await sendVerificationEmail(user, user.verification_token);

        req.session.success = 'Account created! Please check your email to verify your account.';
        res.redirect('/auth/login');

    } catch (err) {
        console.error('Registration error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/auth/register');
    }
});

// GET /auth/login
router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

// POST /auth/login
router.post('/login', isGuest, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.session.error = 'Email and password are required';
            return res.redirect('/auth/login');
        }

        const user = await User.findByEmail(email);
        if (!user) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/auth/login');
        }

        const validPassword = await User.verifyPassword(password, user.password_hash);
        if (!validPassword) {
            req.session.error = 'Invalid email or password';
            return res.redirect('/auth/login');
        }

        // Check if user is suspended
        if (user.suspended) {
            req.session.error = 'Your account has been suspended. Please contact support.';
            return res.redirect('/auth/login');
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Set session
        req.session.user = {
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            profile_photo: user.profile_photo,
            email_verified: user.email_verified
        };

        req.session.success = `Welcome back, ${user.display_name}!`;
        res.redirect('/dashboard');

    } catch (err) {
        console.error('Login error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/auth/login');
    }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.redirect('/');
    });
});

// GET /auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findByVerificationToken(req.params.token);

        if (!user) {
            req.session.error = 'Invalid or expired verification link';
            return res.redirect('/auth/login');
        }

        await User.verifyEmail(user.id);

        // Update session if logged in
        if (req.session.user && req.session.user.id === user.id) {
            req.session.user.email_verified = true;
        }

        req.session.success = 'Email verified successfully! You can now access all features.';
        res.redirect('/dashboard');

    } catch (err) {
        console.error('Verification error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/auth/login');
    }
});

// GET /auth/forgot-password
router.get('/forgot-password', isGuest, (req, res) => {
    res.render('auth/forgot-password', { title: 'Forgot Password' });
});

// POST /auth/forgot-password
router.post('/forgot-password', isGuest, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        // Always show same message for security
        req.session.success = 'If an account exists with this email, you will receive a password reset link.';

        if (user) {
            const token = generateToken();
            await User.setResetToken(user.id, token);
            await sendPasswordResetEmail(user, token);
        }

        res.redirect('/auth/login');

    } catch (err) {
        console.error('Forgot password error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/auth/forgot-password');
    }
});

// GET /auth/reset-password/:token
router.get('/reset-password/:token', isGuest, async (req, res) => {
    const user = await User.findByResetToken(req.params.token);

    if (!user) {
        req.session.error = 'Invalid or expired reset link';
        return res.redirect('/auth/forgot-password');
    }

    res.render('auth/reset-password', {
        title: 'Reset Password',
        token: req.params.token
    });
});

// POST /auth/reset-password/:token
router.post('/reset-password/:token', isGuest, async (req, res) => {
    try {
        const { password, password_confirm } = req.body;
        const user = await User.findByResetToken(req.params.token);

        if (!user) {
            req.session.error = 'Invalid or expired reset link';
            return res.redirect('/auth/forgot-password');
        }

        if (password !== password_confirm) {
            req.session.error = 'Passwords do not match';
            return res.redirect(`/auth/reset-password/${req.params.token}`);
        }

        if (password.length < 8) {
            req.session.error = 'Password must be at least 8 characters';
            return res.redirect(`/auth/reset-password/${req.params.token}`);
        }

        await User.resetPassword(user.id, password);

        req.session.success = 'Password reset successfully. You can now log in.';
        res.redirect('/auth/login');

    } catch (err) {
        console.error('Reset password error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/auth/forgot-password');
    }
});

// GET /auth/resend-verification
router.get('/resend-verification', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        if (user.email_verified) {
            req.session.success = 'Your email is already verified.';
            return res.redirect('/dashboard');
        }

        const token = generateToken();
        await require('../config/database').query(
            'UPDATE users SET verification_token = $1 WHERE id = $2',
            [token, user.id]
        );

        await sendVerificationEmail(user, token);

        req.session.success = 'Verification email sent! Please check your inbox.';
        res.redirect('/dashboard');

    } catch (err) {
        console.error('Resend verification error:', err);
        req.session.error = 'An error occurred. Please try again.';
        res.redirect('/dashboard');
    }
});

module.exports = router;
