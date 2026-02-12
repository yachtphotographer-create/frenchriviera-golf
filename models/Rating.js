const db = require('../config/database');

const Rating = {
    // Create a rating
    async create(data) {
        const {
            game_id, rater_id, rated_id,
            punctuality, pace_of_play, friendliness, would_play_again,
            comment
        } = data;

        // Calculate overall rating
        const overall = (punctuality + pace_of_play + friendliness + would_play_again) / 4;

        const result = await db.query(
            `INSERT INTO ratings (
                game_id, rater_id, rated_id,
                punctuality, pace_of_play, friendliness, would_play_again,
                overall, comment
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (game_id, rater_id, rated_id) DO UPDATE SET
                punctuality = $4, pace_of_play = $5, friendliness = $6,
                would_play_again = $7, overall = $8, comment = $9
            RETURNING *`,
            [game_id, rater_id, rated_id, punctuality, pace_of_play,
             friendliness, would_play_again, overall, comment]
        );

        // Update rated user's average rating
        await this.updateUserRating(rated_id);

        return result.rows[0];
    },

    // Get rating by ID
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM ratings WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Check if user has rated another user for a game
    async hasRated(gameId, raterId, ratedId) {
        const result = await db.query(
            `SELECT id FROM ratings
             WHERE game_id = $1 AND rater_id = $2 AND rated_id = $3`,
            [gameId, raterId, ratedId]
        );
        return result.rows.length > 0;
    },

    // Get ratings received by a user
    async getReceivedByUser(userId, limit = 20) {
        const result = await db.query(
            `SELECT r.*, u.display_name as rater_name, u.profile_photo as rater_photo,
                    g.game_date, c.name as course_name
             FROM ratings r
             JOIN users u ON r.rater_id = u.id
             JOIN games g ON r.game_id = g.id
             JOIN courses c ON g.course_id = c.id
             WHERE r.rated_id = $1
             ORDER BY r.created_at DESC
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    },

    // Get ratings given by a user
    async getGivenByUser(userId, limit = 20) {
        const result = await db.query(
            `SELECT r.*, u.display_name as rated_name, u.profile_photo as rated_photo,
                    g.game_date, c.name as course_name
             FROM ratings r
             JOIN users u ON r.rated_id = u.id
             JOIN games g ON r.game_id = g.id
             JOIN courses c ON g.course_id = c.id
             WHERE r.rater_id = $1
             ORDER BY r.created_at DESC
             LIMIT $2`,
            [userId, limit]
        );
        return result.rows;
    },

    // Get rating stats for a user
    async getUserStats(userId) {
        const result = await db.query(
            `SELECT
                COUNT(*) as total_ratings,
                COALESCE(AVG(overall), 0) as average_rating,
                COALESCE(AVG(punctuality), 0) as avg_punctuality,
                COALESCE(AVG(pace_of_play), 0) as avg_pace,
                COALESCE(AVG(friendliness), 0) as avg_friendliness,
                COALESCE(AVG(would_play_again), 0) as avg_play_again
             FROM ratings
             WHERE rated_id = $1`,
            [userId]
        );
        return result.rows[0];
    },

    // Update user's average rating
    async updateUserRating(userId) {
        const stats = await this.getUserStats(userId);

        await db.query(
            `UPDATE users
             SET average_rating = $1, total_ratings = $2, updated_at = NOW()
             WHERE id = $3`,
            [stats.average_rating, stats.total_ratings, userId]
        );
    },

    // Get players to rate for a game
    async getPlayersToRate(gameId, userId) {
        const result = await db.query(
            `SELECT gp.user_id, u.display_name, u.profile_photo,
                    EXISTS(
                        SELECT 1 FROM ratings r
                        WHERE r.game_id = $1 AND r.rater_id = $2 AND r.rated_id = gp.user_id
                    ) as already_rated
             FROM game_players gp
             JOIN users u ON gp.user_id = u.id
             WHERE gp.game_id = $1
             AND gp.status = 'accepted'
             AND gp.user_id != $2`,
            [gameId, userId]
        );
        return result.rows;
    },

    // Get games that need rating
    async getGamesToRate(userId) {
        const result = await db.query(
            `SELECT DISTINCT g.*, c.name as course_name,
                    (SELECT COUNT(*) FROM game_players gp2
                     WHERE gp2.game_id = g.id AND gp2.status = 'accepted' AND gp2.user_id != $1) as players_count,
                    (SELECT COUNT(*) FROM ratings r
                     WHERE r.game_id = g.id AND r.rater_id = $1) as rated_count
             FROM games g
             JOIN game_players gp ON g.id = gp.game_id
             JOIN courses c ON g.course_id = c.id
             WHERE gp.user_id = $1
             AND gp.status = 'accepted'
             AND g.status = 'completed'
             AND g.game_date < CURRENT_DATE
             HAVING (SELECT COUNT(*) FROM game_players gp2
                     WHERE gp2.game_id = g.id AND gp2.status = 'accepted' AND gp2.user_id != $1) >
                    (SELECT COUNT(*) FROM ratings r
                     WHERE r.game_id = g.id AND r.rater_id = $1)
             ORDER BY g.game_date DESC`,
            [userId]
        );
        return result.rows;
    }
};

module.exports = Rating;
