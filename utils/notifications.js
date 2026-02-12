const db = require('../config/database');

// Create a notification
const createNotification = async (userId, type, title, message, link = null) => {
    try {
        await db.query(
            `INSERT INTO notifications (user_id, type, title, message, link)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, type, title, message, link]
        );
        return true;
    } catch (err) {
        console.error('Error creating notification:', err);
        return false;
    }
};

// Get unread notifications count for user
const getUnreadCount = async (userId) => {
    try {
        const result = await db.query(
            'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
            [userId]
        );
        return parseInt(result.rows[0].count);
    } catch (err) {
        console.error('Error getting unread count:', err);
        return 0;
    }
};

// Get notifications for user
const getNotifications = async (userId, limit = 20) => {
    try {
        const result = await db.query(
            `SELECT * FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    } catch (err) {
        console.error('Error getting notifications:', err);
        return [];
    }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
    try {
        await db.query(
            'UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2',
            [notificationId, userId]
        );
        return true;
    } catch (err) {
        console.error('Error marking notification as read:', err);
        return false;
    }
};

// Mark all notifications as read for user
const markAllAsRead = async (userId) => {
    try {
        await db.query(
            'UPDATE notifications SET read = true WHERE user_id = $1',
            [userId]
        );
        return true;
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        return false;
    }
};

module.exports = {
    createNotification,
    getUnreadCount,
    getNotifications,
    markAsRead,
    markAllAsRead
};
