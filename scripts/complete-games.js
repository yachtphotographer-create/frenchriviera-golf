#!/usr/bin/env node
/**
 * Script to mark past games as completed and notify players to rate each other.
 * Run daily via cron: 0 8 * * * /usr/bin/node /var/www/frenchriviera-golf/scripts/complete-games.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const db = require('../config/database');
const { createNotification } = require('../utils/notifications');

async function completeGames() {
    console.log('[complete-games] Starting...');

    try {
        // Find games that need to be marked as completed
        // Games where date is in the past and status is open/full/confirmed
        const gamesResult = await db.query(`
            SELECT g.*, c.name as course_name
            FROM games g
            JOIN courses c ON g.course_id = c.id
            WHERE g.status IN ('open', 'full', 'confirmed')
            AND g.game_date < CURRENT_DATE
        `);

        const games = gamesResult.rows;
        console.log(`[complete-games] Found ${games.length} games to complete`);

        for (const game of games) {
            console.log(`[complete-games] Processing game ${game.id} at ${game.course_name}`);

            // Mark game as completed
            await db.query(
                `UPDATE games SET status = 'completed', updated_at = NOW() WHERE id = $1`,
                [game.id]
            );

            // Get all accepted players (including creator)
            const playersResult = await db.query(`
                SELECT gp.user_id, u.display_name
                FROM game_players gp
                JOIN users u ON gp.user_id = u.id
                WHERE gp.game_id = $1
                AND (gp.status = 'accepted' OR gp.role = 'creator')
            `, [game.id]);

            const players = playersResult.rows;
            console.log(`[complete-games] Notifying ${players.length} players`);

            // Send notification to each player
            for (const player of players) {
                // Only send if there are other players to rate
                const otherPlayers = players.filter(p => p.user_id !== player.user_id);
                if (otherPlayers.length > 0) {
                    await createNotification(
                        player.user_id,
                        'rate_players',
                        'Rate your playing partners',
                        `Your game at ${game.course_name} is complete! Rate your playing partners.`,
                        `/ratings/game/${game.id}`
                    );
                    console.log(`[complete-games] Notified ${player.display_name}`);
                }
            }
        }

        console.log('[complete-games] Done!');
        process.exit(0);

    } catch (err) {
        console.error('[complete-games] Error:', err);
        process.exit(1);
    }
}

completeGames();
