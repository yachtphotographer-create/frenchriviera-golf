const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Simple admin auth - check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        req.session.error = 'Please log in to access admin';
        return res.redirect('/auth/login');
    }
    // Admin email
    const adminEmail = 'yachtphotographer@gmail.com';
    if (req.session.user.email !== adminEmail) {
        req.session.error = 'Access denied';
        return res.redirect('/dashboard');
    }
    next();
};

// Admin dashboard
router.get('/', isAdmin, async (req, res) => {
    try {
        // Get stats
        const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
        const gamesResult = await db.query('SELECT COUNT(*) as count FROM games');
        const coursesResult = await db.query('SELECT COUNT(*) as count FROM courses');

        // Recent users
        const recentUsers = await db.query(`
            SELECT id, display_name, email, created_at, email_verified, last_login
            FROM users
            ORDER BY created_at DESC
            LIMIT 20
        `);

        // Recent games
        const recentGames = await db.query(`
            SELECT g.*, u.display_name as creator_name, c.name as course_name
            FROM games g
            JOIN users u ON g.creator_id = u.id
            LEFT JOIN courses c ON g.course_id = c.id
            ORDER BY g.created_at DESC
            LIMIT 10
        `);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: {
                users: usersResult.rows[0].count,
                games: gamesResult.rows[0].count,
                courses: coursesResult.rows[0].count
            },
            recentUsers: recentUsers.rows,
            recentGames: recentGames.rows
        });
    } catch (err) {
        console.error('Admin error:', err);
        req.session.error = 'Error loading admin dashboard';
        res.redirect('/dashboard');
    }
});

// View all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await db.query(`
            SELECT id, display_name, email, created_at, email_verified, last_login,
                   handicap, games_played, average_rating
            FROM users
            ORDER BY created_at DESC
        `);

        res.render('admin/users', {
            title: 'All Users',
            users: users.rows
        });
    } catch (err) {
        console.error('Admin users error:', err);
        req.session.error = 'Error loading users';
        res.redirect('/admin');
    }
});

module.exports = router;
