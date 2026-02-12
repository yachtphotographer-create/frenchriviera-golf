const db = require('../config/database');

const Message = {
    // Create a new message
    async create(data) {
        const { game_id, sender_id, content } = data;

        const result = await db.query(
            `INSERT INTO messages (game_id, sender_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [game_id, sender_id, content]
        );
        return result.rows[0];
    },

    // Get messages for a game
    async getByGame(gameId, limit = 100) {
        const result = await db.query(
            `SELECT m.*, u.display_name, u.profile_photo
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.game_id = $1
             ORDER BY m.created_at ASC
             LIMIT $2`,
            [gameId, limit]
        );
        return result.rows;
    },

    // Get recent messages for a game (for initial load)
    async getRecent(gameId, limit = 50) {
        const result = await db.query(
            `SELECT m.*, u.display_name, u.profile_photo
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.game_id = $1
             ORDER BY m.created_at DESC
             LIMIT $2`,
            [gameId, limit]
        );
        return result.rows.reverse();
    },

    // Get message with sender info
    async getWithSender(messageId) {
        const result = await db.query(
            `SELECT m.*, u.display_name, u.profile_photo
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.id = $1`,
            [messageId]
        );
        return result.rows[0];
    },

    // Count messages in a game
    async countByGame(gameId) {
        const result = await db.query(
            'SELECT COUNT(*) FROM messages WHERE game_id = $1',
            [gameId]
        );
        return parseInt(result.rows[0].count);
    },

    // Delete message (by sender only)
    async delete(messageId, senderId) {
        await db.query(
            'DELETE FROM messages WHERE id = $1 AND sender_id = $2',
            [messageId, senderId]
        );
    }
};

module.exports = Message;
