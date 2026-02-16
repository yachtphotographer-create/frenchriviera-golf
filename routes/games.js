const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Course = require('../models/Course');
const { isAuthenticated, isVerified } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// GET /games - Browse open games
router.get('/', async (req, res) => {
    try {
        const { course, department, date, level } = req.query;

        const filters = {};
        if (course) filters.course_id = parseInt(course);
        if (department) filters.department = department;
        if (date) filters.date = date;
        if (level) filters.level = level;

        const games = await Game.findOpen(filters);
        const courses = await Course.findAll();

        res.render('games/index', {
            title: 'Find a Game',
            games,
            courses,
            filters: { course, department, date, level },
            metaDescription: 'Find golf games and playing partners on the French Riviera. Browse open tee times and join games at courses across the Côte d\'Azur.',
            canonicalPath: '/games'
        });

    } catch (err) {
        console.error('Games list error:', err);
        req.session.error = 'Error loading games';
        res.redirect('/');
    }
});

// GET /games/create - Create game form
router.get('/create', isAuthenticated, async (req, res) => {
    try {
        const courses = await Course.findAll();
        const preselectedCourse = req.query.course ? parseInt(req.query.course) : null;

        res.render('games/create', {
            title: 'Create a Game',
            courses,
            preselectedCourse
        });

    } catch (err) {
        console.error('Create game form error:', err);
        req.session.error = 'Error loading form';
        res.redirect('/games');
    }
});

// POST /games/create - Submit new game
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const {
            course_id, game_date, tee_time, spots_total,
            level_min, level_max, pace_preference, transport_preference,
            languages, note
        } = req.body;

        // Validation
        if (!course_id || !game_date || !tee_time || !spots_total) {
            req.session.error = 'Please fill in all required fields';
            return res.redirect('/games/create');
        }

        // Parse languages
        const language_preference = languages ?
            (Array.isArray(languages) ? languages : [languages]) : null;

        const game = await Game.create({
            creator_id: req.session.user.id,
            course_id: parseInt(course_id),
            game_date,
            tee_time,
            spots_total: parseInt(spots_total),
            level_min: level_min || null,
            level_max: level_max || null,
            pace_preference: pace_preference || null,
            transport_preference: transport_preference || null,
            language_preference,
            note: note || null
        });

        req.session.success = 'Game created successfully!';
        res.redirect(`/games/${game.id}`);

    } catch (err) {
        console.error('Create game error:', err);
        req.session.error = 'Error creating game';
        res.redirect('/games/create');
    }
});

// GET /games/mine - My games
router.get('/mine', isAuthenticated, async (req, res) => {
    try {
        const games = await Game.findByPlayer(req.session.user.id);

        // Separate into upcoming and past
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcoming = games.filter(g => new Date(g.game_date) >= now);
        const past = games.filter(g => new Date(g.game_date) < now);

        res.render('games/my-games', {
            title: 'My Games',
            upcoming,
            past
        });

    } catch (err) {
        console.error('My games error:', err);
        req.session.error = 'Error loading your games';
        res.redirect('/dashboard');
    }
});

// GET /games/:id - Game detail
router.get('/:id', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games');
        }

        const players = await Game.getPlayers(gameId);

        // Check current user's status in game
        let userStatus = null;
        let isCreator = false;
        let messages = [];

        if (req.session.user) {
            const userPlayer = players.find(p => p.user_id === req.session.user.id);
            userStatus = userPlayer?.status || null;
            isCreator = game.creator_id === req.session.user.id;

            // Load messages if user is accepted player or creator
            if (userStatus === 'accepted' || isCreator) {
                const Message = require('../models/Message');
                messages = await Message.getRecent(gameId, 50);
            }
        }

        res.render('games/detail', {
            title: `Game at ${game.course_name}`,
            game,
            players,
            userStatus,
            isCreator,
            messages
        });

    } catch (err) {
        console.error('Game detail error:', err);
        req.session.error = 'Error loading game';
        res.redirect('/games');
    }
});

// POST /games/:id/join - Request to join
router.post('/:id/join', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games');
        }

        if (game.status !== 'open') {
            req.session.error = 'This game is no longer accepting players';
            return res.redirect(`/games/${gameId}`);
        }

        if (game.creator_id === req.session.user.id) {
            req.session.error = 'You cannot join your own game';
            return res.redirect(`/games/${gameId}`);
        }

        // Check if already in game
        const existing = await Game.isPlayerInGame(gameId, req.session.user.id);
        if (existing) {
            req.session.error = 'You have already requested to join this game';
            return res.redirect(`/games/${gameId}`);
        }

        await Game.requestJoin(gameId, req.session.user.id);

        // Notify creator
        await createNotification(
            game.creator_id,
            'game_request',
            'New join request',
            `${req.session.user.display_name} wants to join your game at ${game.course_name}`,
            `/games/${gameId}`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user-${game.creator_id}`).emit('new-notification', {
                type: 'game_request',
                title: 'New join request',
                message: `${req.session.user.display_name} wants to join your game at ${game.course_name}`,
                link: `/games/${gameId}`
            });
        }

        req.session.success = 'Join request sent! The game creator will review your request.';
        res.redirect(`/games/${gameId}`);

    } catch (err) {
        console.error('Join game error:', err);
        req.session.error = 'Error joining game';
        res.redirect('/games');
    }
});

// POST /games/:id/accept/:playerId - Accept player
router.post('/:id/accept/:playerId', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const playerId = parseInt(req.params.playerId);
        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            req.session.error = 'Unauthorized';
            return res.redirect('/games');
        }

        await Game.acceptPlayer(gameId, playerId);

        // Notify player
        await createNotification(
            playerId,
            'game_accepted',
            'You\'re in!',
            `Your request to join the game at ${game.course_name} was accepted!`,
            `/games/${gameId}`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user-${playerId}`).emit('new-notification', {
                type: 'game_accepted',
                title: 'You\'re in!',
                message: `Your request to join the game at ${game.course_name} was accepted!`,
                link: `/games/${gameId}`
            });
        }

        req.session.success = 'Player accepted!';
        res.redirect(`/games/${gameId}`);

    } catch (err) {
        console.error('Accept player error:', err);
        req.session.error = 'Error accepting player';
        res.redirect('/games');
    }
});

// POST /games/:id/decline/:playerId - Decline player
router.post('/:id/decline/:playerId', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const playerId = parseInt(req.params.playerId);
        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            req.session.error = 'Unauthorized';
            return res.redirect('/games');
        }

        await Game.declinePlayer(gameId, playerId);

        // Notify player
        await createNotification(
            playerId,
            'game_declined',
            'Request declined',
            `Your request to join the game at ${game.course_name} was declined.`,
            `/games`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user-${playerId}`).emit('new-notification', {
                type: 'game_declined',
                title: 'Request declined',
                message: `Your request to join the game at ${game.course_name} was declined.`,
                link: `/games`
            });
        }

        req.session.success = 'Player declined';
        res.redirect(`/games/${gameId}`);

    } catch (err) {
        console.error('Decline player error:', err);
        req.session.error = 'Error declining player';
        res.redirect('/games');
    }
});

// POST /games/:id/withdraw - Withdraw from game
router.post('/:id/withdraw', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games');
        }

        // Get players before withdrawal to notify them
        const players = await Game.getPlayers(gameId);
        const wasAccepted = players.find(p => p.user_id === req.session.user.id && p.status === 'accepted');

        await Game.withdraw(gameId, req.session.user.id);

        // Only notify if the player was actually accepted (not just pending)
        if (wasAccepted) {
            // Notify the creator
            if (game.creator_id !== req.session.user.id) {
                await createNotification(
                    game.creator_id,
                    'player_withdrawn',
                    'Player withdrew',
                    `${req.session.user.display_name} has withdrawn from your game at ${game.course_name}`,
                    `/games/${gameId}`
                );

                // Push real-time notification
                const io = req.app.get('io');
                if (io) {
                    io.to(`user-${game.creator_id}`).emit('new-notification', {
                        type: 'player_withdrawn',
                        title: 'Player withdrew',
                        message: `${req.session.user.display_name} has withdrawn from your game at ${game.course_name}`,
                        link: `/games/${gameId}`
                    });
                }
            }

            // Notify other accepted players
            for (const player of players) {
                if (player.user_id !== req.session.user.id &&
                    player.user_id !== game.creator_id &&
                    (player.status === 'accepted' || player.role === 'creator')) {
                    await createNotification(
                        player.user_id,
                        'player_withdrawn',
                        'Player withdrew',
                        `${req.session.user.display_name} has withdrawn from the game at ${game.course_name}`,
                        `/games/${gameId}`
                    );

                    // Push real-time notification
                    const io = req.app.get('io');
                    if (io) {
                        io.to(`user-${player.user_id}`).emit('new-notification', {
                            type: 'player_withdrawn',
                            title: 'Player withdrew',
                            message: `${req.session.user.display_name} has withdrawn from the game at ${game.course_name}`,
                            link: `/games/${gameId}`
                        });
                    }
                }
            }
        }

        req.session.success = 'You have withdrawn from this game';
        res.redirect(`/games/${gameId}`);

    } catch (err) {
        console.error('Withdraw error:', err);
        req.session.error = 'Error withdrawing from game';
        res.redirect('/games');
    }
});

// POST /games/:id/cancel - Cancel game (creator only)
router.post('/:id/cancel', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            req.session.error = 'Unauthorized';
            return res.redirect('/games');
        }

        // Notify all accepted players
        const players = await Game.getPlayers(gameId);
        const io = req.app.get('io');

        for (const player of players) {
            if (player.user_id !== req.session.user.id && player.status === 'accepted') {
                await createNotification(
                    player.user_id,
                    'game_cancelled',
                    'Game cancelled',
                    `The game at ${game.course_name} on ${new Date(game.game_date).toLocaleDateString()} has been cancelled.`,
                    `/games`
                );

                // Push real-time notification
                if (io) {
                    io.to(`user-${player.user_id}`).emit('new-notification', {
                        type: 'game_cancelled',
                        title: 'Game cancelled',
                        message: `The game at ${game.course_name} on ${new Date(game.game_date).toLocaleDateString()} has been cancelled.`,
                        link: `/games`
                    });
                }
            }
        }

        await Game.cancel(gameId, req.session.user.id);

        req.session.success = 'Game cancelled';
        res.redirect('/games/mine');

    } catch (err) {
        console.error('Cancel game error:', err);
        req.session.error = 'Error cancelling game';
        res.redirect('/games');
    }
});

// POST /games/:id/invite/:userId - Invite a player
router.post('/:id/invite/:userId', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const userId = parseInt(req.params.userId);
        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            req.session.error = 'Unauthorized';
            return res.redirect('/games');
        }

        await Game.invitePlayer(gameId, userId, req.session.user.id);

        // Notify invited player
        await createNotification(
            userId,
            'invitation',
            'Game invitation',
            `${req.session.user.display_name} invited you to play at ${game.course_name}`,
            `/games/${gameId}`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user-${userId}`).emit('new-notification', {
                type: 'invitation',
                title: 'Game invitation',
                message: `${req.session.user.display_name} invited you to play at ${game.course_name}`,
                link: `/games/${gameId}`
            });
        }

        req.session.success = 'Invitation sent!';
        res.redirect(req.get('Referer') || `/games/${gameId}`);

    } catch (err) {
        console.error('Invite player error:', err);
        req.session.error = 'Error inviting player';
        res.redirect('/games');
    }
});

module.exports = router;
