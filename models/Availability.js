const db = require('../config/database');

const Availability = {
    // Create availability
    async create(data) {
        const { user_id, available_date, time_window, course_id, area, note } = data;

        const result = await db.query(
            `INSERT INTO availability (user_id, available_date, time_window, course_id, area, note)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [user_id, available_date, time_window, course_id, area, note]
        );
        return result.rows[0];
    },

    // Find by ID
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM availability WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Get active availability for a user
    async findByUser(userId) {
        const result = await db.query(
            `SELECT a.*, c.name as course_name
             FROM availability a
             LEFT JOIN courses c ON a.course_id = c.id
             WHERE a.user_id = $1 AND a.active = true AND a.available_date >= CURRENT_DATE
             ORDER BY a.available_date`,
            [userId]
        );
        return result.rows;
    },

    // Get all active availability with filters
    async findActive(filters = {}) {
        let query = `
            SELECT a.*,
                   u.id as user_id, u.display_name, u.profile_photo, u.handicap,
                   u.playing_level, u.nationality, u.languages,
                   c.name as course_name, c.slug as course_slug
            FROM availability a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN courses c ON a.course_id = c.id
            WHERE a.active = true AND a.available_date >= CURRENT_DATE
        `;
        const params = [];
        let paramIndex = 1;

        // Exclude current user if provided
        if (filters.exclude_user) {
            query += ` AND a.user_id != $${paramIndex}`;
            params.push(filters.exclude_user);
            paramIndex++;
        }

        if (filters.date) {
            query += ` AND a.available_date = $${paramIndex}`;
            params.push(filters.date);
            paramIndex++;
        }

        if (filters.area) {
            query += ` AND (a.area = $${paramIndex} OR a.area = 'any')`;
            params.push(filters.area);
            paramIndex++;
        }

        if (filters.course_id) {
            query += ` AND (a.course_id = $${paramIndex} OR a.course_id IS NULL)`;
            params.push(filters.course_id);
            paramIndex++;
        }

        if (filters.time_window) {
            query += ` AND (a.time_window = $${paramIndex} OR a.time_window = 'all_day')`;
            params.push(filters.time_window);
            paramIndex++;
        }

        query += ' ORDER BY a.available_date, u.display_name';

        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(filters.limit);
        }

        const result = await db.query(query, params);
        return result.rows;
    },

    // Deactivate availability
    async deactivate(id, userId) {
        await db.query(
            `UPDATE availability SET active = false
             WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
    },

    // Deactivate all availability for user on a date
    async deactivateForDate(userId, date) {
        await db.query(
            `UPDATE availability SET active = false
             WHERE user_id = $1 AND available_date = $2`,
            [userId, date]
        );
    },

    // Delete availability
    async delete(id, userId) {
        await db.query(
            'DELETE FROM availability WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
    },

    // Clean up past availability
    async cleanupPast() {
        await db.query(
            `UPDATE availability SET active = false
             WHERE available_date < CURRENT_DATE AND active = true`
        );
    }
};

module.exports = Availability;
