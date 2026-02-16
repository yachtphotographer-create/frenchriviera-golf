const db = require('../config/database');

const Game = {
    // Create a new game
    async create(gameData) {
        const {
            creator_id, course_id, game_date, tee_time, spots_total,
            level_min, level_max, pace_preference, transport_preference,
            language_preference, note
        } = gameData;

        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Create the game
            const gameResult = await client.query(
                `INSERT INTO games (
                    creator_id, course_id, game_date, tee_time, spots_total,
                    level_min, level_max, pace_preference, transport_preference,
                    language_preference, note
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *`,
                [creator_id, course_id, game_date, tee_time, spots_total,
                 level_min, level_max, pace_preference, transport_preference,
                 language_preference, note]
            );

            const game = gameResult.rows[0];

            // Add creator as a player with 'creator' role and 'accepted' status
            await client.query(
                `INSERT INTO game_players (game_id, user_id, role, status)
                 VALUES ($1, $2, 'creator', 'accepted')`,
                [game.id, creator_id]
            );

            await client.query('COMMIT');
            return game;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // Find game by ID with full details
    async findById(id) {
        const result = await db.query(
            `SELECT g.*,
                    c.name as course_name, c.slug as course_slug, c.city as course_city,
                    u.display_name as creator_name, u.profile_photo as creator_photo,
                    u.handicap as creator_handicap, u.playing_level as creator_level
             FROM games g
             JOIN courses c ON g.course_id = c.id
             JOIN users u ON g.creator_id = u.id
             WHERE g.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Get all open games with filters
    async findOpen(filters = {}) {
        let query = `
            SELECT g.*,
                   c.name as course_name, c.slug as course_slug, c.city as course_city,
                   c.department as course_department,
                   u.display_name as creator_name, u.profile_photo as creator_photo,
                   u.handicap as creator_handicap
            FROM games g
            JOIN courses c ON g.course_id = c.id
            JOIN users u ON g.creator_id = u.id
            WHERE g.status = 'open' AND g.game_date >= CURRENT_DATE
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.course_id) {
            query += ` AND g.course_id = $${paramIndex}`;
            params.push(filters.course_id);
            paramIndex++;
        }

        if (filters.department) {
            query += ` AND c.department = $${paramIndex}`;
            params.push(filters.department);
            paramIndex++;
        }

        if (filters.date) {
            query += ` AND g.game_date = $${paramIndex}`;
            params.push(filters.date);
            paramIndex++;
        }

        if (filters.level) {
            query += ` AND (g.level_min IS NULL OR g.level_min <= $${paramIndex})
                       AND (g.level_max IS NULL OR g.level_max >= $${paramIndex})`;
            params.push(filters.level);
            paramIndex++;
        }

        query += ' ORDER BY g.game_date, g.tee_time';

        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(filters.limit);
        }

        const result = await db.query(query, params);
        return result.rows;
    },

    // Get games created by a user
    async findByCreator(userId) {
        const result = await db.query(
            `SELECT g.*, c.name as course_name, c.slug as course_slug
             FROM games g
             JOIN courses c ON g.course_id = c.id
             WHERE g.creator_id = $1
             ORDER BY g.game_date DESC, g.tee_time`,
            [userId]
        );
        return result.rows;
    },

    // Get games a user has joined
    async findByPlayer(userId) {
        const result = await db.query(
            `SELECT g.*, c.name as course_name, c.slug as course_slug,
                    gp.status as player_status, gp.role,
                    u.display_name as creator_name
             FROM games g
             JOIN courses c ON g.course_id = c.id
             JOIN game_players gp ON g.id = gp.game_id
             JOIN users u ON g.creator_id = u.id
             WHERE gp.user_id = $1
             ORDER BY g.game_date DESC, g.tee_time`,
            [userId]
        );
        return result.rows;
    },

    // Get players in a game
    async getPlayers(gameId) {
        const result = await db.query(
            `SELECT gp.*, u.display_name, u.profile_photo, u.handicap,
                    u.playing_level, u.nationality
             FROM game_players gp
             JOIN users u ON gp.user_id = u.id
             WHERE gp.game_id = $1
             ORDER BY gp.role DESC, gp.created_at`,
            [gameId]
        );
        return result.rows;
    },

    // Request to join a game
    async requestJoin(gameId, userId) {
        const result = await db.query(
            `INSERT INTO game_players (game_id, user_id, role, status)
             VALUES ($1, $2, 'player', 'pending')
             ON CONFLICT (game_id, user_id) DO UPDATE
             SET status = 'pending', updated_at = NOW()
             WHERE game_players.status IN ('withdrawn', 'declined')
             RETURNING *`,
            [gameId, userId]
        );
        return result.rows[0];
    },

    // Accept a player
    async acceptPlayer(gameId, playerId) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Update player status
            await client.query(
                `UPDATE game_players SET status = 'accepted', updated_at = NOW()
                 WHERE game_id = $1 AND user_id = $2`,
                [gameId, playerId]
            );

            // Increment spots_filled
            await client.query(
                `UPDATE games SET spots_filled = spots_filled + 1, updated_at = NOW()
                 WHERE id = $1`,
                [gameId]
            );

            // Check if game is now full
            const gameResult = await client.query(
                'SELECT spots_total, spots_filled FROM games WHERE id = $1',
                [gameId]
            );
            const game = gameResult.rows[0];

            if (game.spots_filled >= game.spots_total) {
                await client.query(
                    `UPDATE games SET status = 'full', updated_at = NOW() WHERE id = $1`,
                    [gameId]
                );
            }

            await client.query('COMMIT');
            return true;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // Decline a player
    async declinePlayer(gameId, playerId) {
        await db.query(
            `UPDATE game_players SET status = 'declined', updated_at = NOW()
             WHERE game_id = $1 AND user_id = $2`,
            [gameId, playerId]
        );
    },

    // Withdraw from a game
    async withdraw(gameId, userId) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // Get current status
            const playerResult = await client.query(
                'SELECT status FROM game_players WHERE game_id = $1 AND user_id = $2',
                [gameId, userId]
            );

            if (playerResult.rows[0]?.status === 'accepted') {
                // Decrement spots_filled
                await client.query(
                    `UPDATE games SET spots_filled = spots_filled - 1,
                     status = CASE WHEN status = 'full' THEN 'open' ELSE status END,
                     updated_at = NOW()
                     WHERE id = $1`,
                    [gameId]
                );
            }

            await client.query(
                `UPDATE game_players SET status = 'withdrawn', updated_at = NOW()
                 WHERE game_id = $1 AND user_id = $2`,
                [gameId, userId]
            );

            await client.query('COMMIT');
            return true;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // Invite a player to a game
    async invitePlayer(gameId, userId, invitedBy) {
        const result = await db.query(
            `INSERT INTO game_players (game_id, user_id, role, status, invited_by)
             VALUES ($1, $2, 'player', 'pending', $3)
             ON CONFLICT (game_id, user_id) DO NOTHING
             RETURNING *`,
            [gameId, userId, invitedBy]
        );
        return result.rows[0];
    },

    // Cancel a game
    async cancel(gameId, userId) {
        await db.query(
            `UPDATE games SET status = 'cancelled', updated_at = NOW()
             WHERE id = $1 AND creator_id = $2`,
            [gameId, userId]
        );
    },

    // Check if user is in a game
    async isPlayerInGame(gameId, userId) {
        const result = await db.query(
            `SELECT * FROM game_players
             WHERE game_id = $1 AND user_id = $2 AND status != 'withdrawn' AND status != 'declined'`,
            [gameId, userId]
        );
        return result.rows[0];
    },

    // Update game status (for cron job to mark completed games)
    async markCompleted() {
        await db.query(
            `UPDATE games SET status = 'completed', updated_at = NOW()
             WHERE status IN ('open', 'full', 'confirmed')
             AND game_date < CURRENT_DATE`
        );
    }
};

module.exports = Game;
