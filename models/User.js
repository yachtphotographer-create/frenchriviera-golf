const db = require('../config/database');
const bcrypt = require('bcrypt');

const User = {
    // Create a new user
    async create(userData) {
        const { email, password, display_name } = userData;
        const password_hash = await bcrypt.hash(password, 10);
        const verification_token = require('../utils/helpers').generateToken();

        const result = await db.query(
            `INSERT INTO users (email, password_hash, display_name, verification_token)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, display_name, email_verified, created_at`,
            [email.toLowerCase(), password_hash, display_name, verification_token]
        );
        return { ...result.rows[0], verification_token };
    },

    // Find user by email
    async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        return result.rows[0];
    },

    // Find user by ID
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Find user by verification token
    async findByVerificationToken(token) {
        const result = await db.query(
            'SELECT * FROM users WHERE verification_token = $1',
            [token]
        );
        return result.rows[0];
    },

    // Find user by reset token
    async findByResetToken(token) {
        const result = await db.query(
            `SELECT * FROM users
             WHERE reset_token = $1 AND reset_token_expires > NOW()`,
            [token]
        );
        return result.rows[0];
    },

    // Verify password
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    },

    // Verify email
    async verifyEmail(userId) {
        await db.query(
            `UPDATE users
             SET email_verified = true, verification_token = NULL, updated_at = NOW()
             WHERE id = $1`,
            [userId]
        );
    },

    // Update last login
    async updateLastLogin(userId) {
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [userId]
        );
    },

    // Update profile
    async updateProfile(userId, profileData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        const allowedFields = [
            'display_name', 'profile_photo', 'nationality', 'languages', 'bio',
            'location_type', 'location_city', 'visiting_from', 'visiting_until', 'phone',
            'handicap', 'handicap_type', 'playing_level', 'pace_preference',
            'transport_preference', 'typical_tee_time', 'usual_days',
            'vibe', 'group_preference', 'post_round', 'favorite_courses'
        ];

        for (const field of allowedFields) {
            if (profileData[field] !== undefined) {
                fields.push(`${field} = $${paramIndex}`);
                values.push(profileData[field]);
                paramIndex++;
            }
        }

        if (fields.length === 0) return;

        fields.push(`updated_at = NOW()`);
        values.push(userId);

        await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
            values
        );
    },

    // Update profile photo
    async updatePhoto(userId, photoPath) {
        await db.query(
            'UPDATE users SET profile_photo = $1, updated_at = NOW() WHERE id = $2',
            [photoPath, userId]
        );
    },

    // Set password reset token
    async setResetToken(userId, token) {
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await db.query(
            `UPDATE users
             SET reset_token = $1, reset_token_expires = $2, updated_at = NOW()
             WHERE id = $3`,
            [token, expires, userId]
        );
    },

    // Reset password
    async resetPassword(userId, newPassword) {
        const password_hash = await bcrypt.hash(newPassword, 10);
        await db.query(
            `UPDATE users
             SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW()
             WHERE id = $2`,
            [password_hash, userId]
        );
    },

    // Get public profile (limited fields)
    async getPublicProfile(userId) {
        const result = await db.query(
            `SELECT id, display_name, profile_photo, nationality, languages, bio,
                    location_type, location_city, handicap, handicap_type, playing_level,
                    pace_preference, transport_preference, typical_tee_time, usual_days,
                    vibe, group_preference, post_round, games_played, average_rating,
                    total_ratings, favorite_courses, created_at
             FROM users WHERE id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    // Update stats after game
    async updateStats(userId) {
        // Recalculate average rating
        const ratingResult = await db.query(
            `SELECT AVG(overall) as avg_rating, COUNT(*) as total
             FROM ratings WHERE rated_id = $1`,
            [userId]
        );

        // Count completed games
        const gamesResult = await db.query(
            `SELECT COUNT(*) as games
             FROM game_players gp
             JOIN games g ON gp.game_id = g.id
             WHERE gp.user_id = $1 AND gp.status = 'accepted' AND g.status = 'completed'`,
            [userId]
        );

        await db.query(
            `UPDATE users
             SET average_rating = $1, total_ratings = $2, games_played = $3, updated_at = NOW()
             WHERE id = $4`,
            [
                ratingResult.rows[0].avg_rating || 0,
                parseInt(ratingResult.rows[0].total),
                parseInt(gamesResult.rows[0].games),
                userId
            ]
        );
    }
};

module.exports = User;
