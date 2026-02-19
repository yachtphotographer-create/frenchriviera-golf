const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { sendEmail } = require('../utils/email');

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

// Analytics dashboard
router.get('/analytics', isAdmin, async (req, res) => {
    try {
        // User growth - last 12 months
        const userGrowth = await db.query(`
            SELECT
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM users
            WHERE created_at > NOW() - INTERVAL '12 months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month
        `);

        // Gender distribution
        const genderDist = await db.query(`
            SELECT
                COALESCE(gender, 'not_specified') as gender,
                COUNT(*) as count
            FROM users
            GROUP BY gender
        `);

        // Age distribution (using birth_date)
        const ageDist = await db.query(`
            SELECT age_group, COUNT(*) as count FROM (
                SELECT
                    CASE
                        WHEN birth_date IS NULL THEN 'Unknown'
                        WHEN EXTRACT(YEAR FROM AGE(birth_date)) < 25 THEN 'Under 25'
                        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 25 AND 34 THEN '25-34'
                        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 35 AND 44 THEN '35-44'
                        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 45 AND 54 THEN '45-54'
                        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 55 AND 64 THEN '55-64'
                        ELSE '65+'
                    END as age_group
                FROM users
            ) sub
            GROUP BY age_group
            ORDER BY
                CASE age_group
                    WHEN 'Under 25' THEN 1
                    WHEN '25-34' THEN 2
                    WHEN '35-44' THEN 3
                    WHEN '45-54' THEN 4
                    WHEN '55-64' THEN 5
                    WHEN '65+' THEN 6
                    ELSE 7
                END
        `);

        // Nationality distribution
        const nationalityDist = await db.query(`
            SELECT
                COALESCE(nationality, 'Not specified') as nationality,
                COUNT(*) as count
            FROM users
            GROUP BY nationality
            ORDER BY count DESC
            LIMIT 10
        `);

        // Games per week - last 12 weeks
        const gamesPerWeek = await db.query(`
            SELECT
                DATE_TRUNC('week', created_at) as week,
                COUNT(*) as count
            FROM games
            WHERE created_at > NOW() - INTERVAL '12 weeks'
            GROUP BY DATE_TRUNC('week', created_at)
            ORDER BY week
        `);

        // Game status distribution
        const gameStatus = await db.query(`
            SELECT
                status,
                COUNT(*) as count
            FROM games
            GROUP BY status
        `);

        // Popular courses
        const popularCourses = await db.query(`
            SELECT
                c.name,
                COUNT(g.id) as games_count
            FROM courses c
            LEFT JOIN games g ON c.id = g.course_id
            GROUP BY c.id, c.name
            ORDER BY games_count DESC
            LIMIT 10
        `);

        // Playing level distribution
        const levelDist = await db.query(`
            SELECT
                COALESCE(playing_level, 'not_specified') as level,
                COUNT(*) as count
            FROM users
            GROUP BY playing_level
        `);

        // Handicap distribution
        const handicapDist = await db.query(`
            SELECT range, COUNT(*) as count FROM (
                SELECT
                    CASE
                        WHEN handicap IS NULL THEN 'Not specified'
                        WHEN handicap < 5 THEN '0-4'
                        WHEN handicap < 10 THEN '5-9'
                        WHEN handicap < 15 THEN '10-14'
                        WHEN handicap < 20 THEN '15-19'
                        WHEN handicap < 25 THEN '20-24'
                        WHEN handicap < 30 THEN '25-29'
                        ELSE '30+'
                    END as range
                FROM users
            ) sub
            GROUP BY range
            ORDER BY
                CASE range
                    WHEN '0-4' THEN 1
                    WHEN '5-9' THEN 2
                    WHEN '10-14' THEN 3
                    WHEN '15-19' THEN 4
                    WHEN '20-24' THEN 5
                    WHEN '25-29' THEN 6
                    WHEN '30+' THEN 7
                    ELSE 8
                END
        `);

        // Key stats
        const totalUsers = await db.query('SELECT COUNT(*) as count FROM users');
        const totalGames = await db.query('SELECT COUNT(*) as count FROM games');
        const completedGames = await db.query("SELECT COUNT(*) as count FROM games WHERE status = 'completed'");
        const avgHandicap = await db.query('SELECT ROUND(AVG(handicap)::numeric, 1) as avg FROM users WHERE handicap IS NOT NULL');

        res.render('admin/analytics', {
            title: 'Analytics Dashboard',
            stats: {
                totalUsers: totalUsers.rows[0].count,
                totalGames: totalGames.rows[0].count,
                completedGames: completedGames.rows[0].count,
                avgHandicap: avgHandicap.rows[0].avg || 'N/A',
                completionRate: totalGames.rows[0].count > 0
                    ? Math.round((completedGames.rows[0].count / totalGames.rows[0].count) * 100)
                    : 0
            },
            data: {
                userGrowth: userGrowth.rows,
                genderDist: genderDist.rows,
                ageDist: ageDist.rows,
                nationalityDist: nationalityDist.rows,
                gamesPerWeek: gamesPerWeek.rows,
                gameStatus: gameStatus.rows,
                popularCourses: popularCourses.rows,
                levelDist: levelDist.rows,
                handicapDist: handicapDist.rows
            }
        });
    } catch (err) {
        console.error('Admin analytics error:', err);
        req.session.error = 'Error loading analytics';
        res.redirect('/admin');
    }
});

// View all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await db.query(`
            SELECT id, display_name, email, created_at, email_verified, last_login,
                   handicap, games_played, average_rating,
                   COALESCE(suspended, false) as suspended, suspended_at, suspended_reason
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

// Suspend user
router.post('/users/:id/suspend', isAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { reason } = req.body;

        await db.query(`
            UPDATE users
            SET suspended = true, suspended_at = NOW(), suspended_reason = $1
            WHERE id = $2
        `, [reason || 'No reason provided', userId]);

        req.session.success = 'User suspended';
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Suspend user error:', err);
        req.session.error = 'Error suspending user';
        res.redirect('/admin/users');
    }
});

// Unsuspend user
router.post('/users/:id/unsuspend', isAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        await db.query(`
            UPDATE users
            SET suspended = false, suspended_at = NULL, suspended_reason = NULL
            WHERE id = $1
        `, [userId]);

        req.session.success = 'User unsuspended';
        res.redirect('/admin/users');
    } catch (err) {
        console.error('Unsuspend user error:', err);
        req.session.error = 'Error unsuspending user';
        res.redirect('/admin/users');
    }
});

// Email form page
router.get('/email', isAdmin, async (req, res) => {
    try {
        const users = await db.query(`
            SELECT id, display_name, email
            FROM users
            WHERE COALESCE(suspended, false) = false
            ORDER BY display_name
        `);

        res.render('admin/email', {
            title: 'Email Users',
            users: users.rows
        });
    } catch (err) {
        console.error('Admin email page error:', err);
        req.session.error = 'Error loading email page';
        res.redirect('/admin');
    }
});

// Send email to selected users
router.post('/email', isAdmin, async (req, res) => {
    try {
        const { user_ids, subject, message } = req.body;

        if (!subject || !message) {
            req.session.error = 'Subject and message are required';
            return res.redirect('/admin/email');
        }

        // Get selected user IDs
        let selectedIds = [];
        if (user_ids === 'all') {
            const allUsers = await db.query('SELECT email FROM users WHERE COALESCE(suspended, false) = false');
            selectedIds = allUsers.rows.map(u => u.email);
        } else if (user_ids) {
            const ids = Array.isArray(user_ids) ? user_ids : [user_ids];
            const users = await db.query('SELECT email FROM users WHERE id = ANY($1)', [ids.map(id => parseInt(id))]);
            selectedIds = users.rows.map(u => u.email);
        }

        if (selectedIds.length === 0) {
            req.session.error = 'No users selected';
            return res.redirect('/admin/email');
        }

        // Create HTML email
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1B5E20;">French Riviera Golf</h1>
                <div style="white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">French Riviera Golf - Find your perfect golf partners on the Cote d'Azur</p>
            </div>
        `;

        // Send emails
        let sent = 0;
        let failed = 0;
        for (const email of selectedIds) {
            const success = await sendEmail(email, subject, html);
            if (success) sent++;
            else failed++;
        }

        req.session.success = `Email sent to ${sent} user${sent !== 1 ? 's' : ''}${failed > 0 ? ` (${failed} failed)` : ''}`;
        res.redirect('/admin/email');

    } catch (err) {
        console.error('Send email error:', err);
        req.session.error = 'Error sending emails';
        res.redirect('/admin/email');
    }
});

module.exports = router;
