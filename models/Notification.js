const db = require('../config/database');

const Notification = {
    // Create a new notification
    async create({ user_id, type, title, message, link }) {
        const result = await db.query(
            `INSERT INTO notifications (user_id, type, title, message, link)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [user_id, type, title, message, link]
        );
        return result.rows[0];
    },

    // Get all notifications for a user
    async getForUser(userId, limit = 20) {
        const result = await db.query(
            `SELECT * FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    },

    // Get unread count for a user
    async getUnreadCount(userId) {
        const result = await db.query(
            `SELECT COUNT(*) as count FROM notifications
             WHERE user_id = $1 AND read = false`,
            [userId]
        );
        return parseInt(result.rows[0].count);
    },

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        await db.query(
            `UPDATE notifications SET read = true
             WHERE id = $1 AND user_id = $2`,
            [notificationId, userId]
        );
    },

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        await db.query(
            `UPDATE notifications SET read = true
             WHERE user_id = $1`,
            [userId]
        );
    },

    // Delete old notifications (older than 30 days)
    async deleteOld() {
        await db.query(
            `DELETE FROM notifications
             WHERE created_at < NOW() - INTERVAL '30 days'`
        );
    }
};

module.exports = Notification;
