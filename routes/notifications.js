const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require('../utils/notifications');

// GET /notifications - View all notifications
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const notifications = await getNotifications(req.session.user.id, 50);

        res.render('notifications/index', {
            title: 'Notifications',
            notifications
        });

    } catch (err) {
        console.error('Notifications error:', err);
        req.session.error = 'Error loading notifications';
        res.redirect('/dashboard');
    }
});

// POST /notifications/:id/read - Mark notification as read
router.post('/:id/read', isAuthenticated, async (req, res) => {
    try {
        const notificationId = parseInt(req.params.id);
        await markAsRead(notificationId, req.session.user.id);

        // If there's a redirect URL in the query, go there
        const redirect = req.query.redirect || '/notifications';
        res.redirect(redirect);

    } catch (err) {
        console.error('Mark read error:', err);
        res.redirect('/notifications');
    }
});

// GET /notifications/:id/click - Mark as read and redirect to link (for clicking on notifications)
router.get('/:id/click', isAuthenticated, async (req, res) => {
    try {
        const notificationId = parseInt(req.params.id);
        await markAsRead(notificationId, req.session.user.id);

        // Redirect to the notification link
        const redirect = req.query.redirect || '/notifications';
        res.redirect(redirect);

    } catch (err) {
        console.error('Notification click error:', err);
        res.redirect('/notifications');
    }
});

// POST /notifications/read-all - Mark all as read
router.post('/read-all', isAuthenticated, async (req, res) => {
    try {
        await markAllAsRead(req.session.user.id);
        req.session.success = 'All notifications marked as read';
        res.redirect('/notifications');

    } catch (err) {
        console.error('Mark all read error:', err);
        res.redirect('/notifications');
    }
});

// GET /notifications/api - Get notifications as JSON (for dropdown)
router.get('/api', isAuthenticated, async (req, res) => {
    try {
        const notifications = await getNotifications(req.session.user.id, 10);
        res.json({ notifications });

    } catch (err) {
        console.error('Notifications API error:', err);
        res.status(500).json({ error: 'Error loading notifications' });
    }
});

module.exports = router;
