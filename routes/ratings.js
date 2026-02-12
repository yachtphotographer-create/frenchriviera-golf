const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Game = require('../models/Game');
const { isAuthenticated } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// GET /ratings/game/:gameId - Rate players from a game
router.get('/game/:gameId', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.gameId);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games/mine');
        }

        // Check if game is completed
        if (game.status !== 'completed') {
            req.session.error = 'You can only rate players after the game is completed';
            return res.redirect(`/games/${gameId}`);
        }

        // Check if user was in the game
        const player = await Game.isPlayerInGame(gameId, req.session.user.id);
        if (!player || player.status !== 'accepted') {
            req.session.error = 'You were not part of this game';
            return res.redirect('/games/mine');
        }

        // Get players to rate
        const playersToRate = await Rating.getPlayersToRate(gameId, req.session.user.id);

        res.render('ratings/game', {
            title: 'Rate Your Playing Partners',
            game,
            playersToRate
        });

    } catch (err) {
        console.error('Rating form error:', err);
        req.session.error = 'Error loading rating form';
        res.redirect('/games/mine');
    }
});

// POST /ratings/submit - Submit ratings
router.post('/submit', isAuthenticated, async (req, res) => {
    try {
        const { game_id, ratings } = req.body;
        const gameId = parseInt(game_id);

        if (!ratings || !Array.isArray(ratings)) {
            req.session.error = 'No ratings submitted';
            return res.redirect(`/ratings/game/${gameId}`);
        }

        const game = await Game.findById(gameId);

        for (const rating of ratings) {
            const { user_id, punctuality, pace_of_play, friendliness, would_play_again, comment } = rating;

            if (!user_id || !punctuality || !pace_of_play || !friendliness || !would_play_again) {
                continue;
            }

            await Rating.create({
                game_id: gameId,
                rater_id: req.session.user.id,
                rated_id: parseInt(user_id),
                punctuality: parseInt(punctuality),
                pace_of_play: parseInt(pace_of_play),
                friendliness: parseInt(friendliness),
                would_play_again: parseInt(would_play_again),
                comment: comment || null
            });

            // Notify the rated user
            await createNotification(
                parseInt(user_id),
                'rating_received',
                'New rating received',
                `${req.session.user.display_name} rated you from the game at ${game.course_name}`,
                `/profile`
            );
        }

        req.session.success = 'Ratings submitted successfully!';
        res.redirect('/dashboard');

    } catch (err) {
        console.error('Submit rating error:', err);
        req.session.error = 'Error submitting ratings';
        res.redirect('/dashboard');
    }
});

// GET /ratings/user/:userId - View user's ratings
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const User = require('../models/User');

        const user = await User.getPublicProfile(userId);
        if (!user) {
            req.session.error = 'User not found';
            return res.redirect('/');
        }

        const ratings = await Rating.getReceivedByUser(userId);
        const stats = await Rating.getUserStats(userId);

        res.render('ratings/user', {
            title: `${user.display_name}'s Ratings`,
            profile: user,
            ratings,
            stats
        });

    } catch (err) {
        console.error('User ratings error:', err);
        req.session.error = 'Error loading ratings';
        res.redirect('/');
    }
});

module.exports = router;
