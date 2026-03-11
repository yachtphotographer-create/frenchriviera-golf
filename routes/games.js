const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Course = require('../models/Course');
const { isAuthenticated, isVerified } = require('../middleware/auth');
const { requireLaunched } = require('../utils/launch');
const { createNotification, createTranslatedNotification, getUserLanguage } = require('../utils/notifications');
const { translations } = require('../middleware/language');

// GET /games - Browse open games
router.get('/', async (req, res) => {
    try {
        const { course, department, date, level, gender } = req.query;

        const filters = {};
        if (course) filters.course_id = parseInt(course);
        if (department) filters.department = department;
        if (date) filters.date = date;
        if (level) filters.level = level;
        if (gender) filters.gender_preference = gender;

        const games = await Game.findOpen(filters);
        const courses = await Course.findAll();

        res.render('games/index', {
            title: 'Find a Game',
            games,
            courses,
            filters: { course, department, date, level, gender },
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
router.get('/create', isAuthenticated, requireLaunched, async (req, res) => {
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
router.post('/create', isAuthenticated, requireLaunched, async (req, res) => {
    try {
        const {
            course_id, game_date, tee_time, spots_total,
            level_min, level_max, pace_preference, transport_preference,
            languages, note, gender_preference
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
            note: note || null,
            gender_preference: gender_preference || 'mixed'
        });

        // Notify players in the area about the new game
        try {
            const course = await Course.findById(parseInt(course_id));
            if (course) {
                // Find players who might be interested:
                // 1. Players with availability on this date in this area/course
                // 2. Players whose location_city matches the course city
                const db = require('../config/database');

                const interestedPlayersResult = await db.query(`
                    SELECT DISTINCT u.id, u.display_name
                    FROM users u
                    WHERE u.id != $1
                    AND u.email_verified = true
                    AND (
                        -- Players with matching availability
                        u.id IN (
                            SELECT a.user_id FROM availability a
                            WHERE a.active = true
                            AND a.available_date = $2
                            AND (a.course_id = $3 OR a.course_id IS NULL)
                            AND (a.area IS NULL OR a.area = '' OR a.area = $4 OR a.area = 'any')
                        )
                        -- OR players located in the same city
                        OR LOWER(u.location_city) = LOWER($4)
                    )
                    LIMIT 50
                `, [req.session.user.id, game_date, parseInt(course_id), course.city]);

                const interestedPlayers = interestedPlayersResult.rows;
                const io = req.app.get('io');

                for (const player of interestedPlayers) {
                    const playerLang = await getUserLanguage(player.id);
                    const gameDate = new Date(game_date).toLocaleDateString(playerLang === 'fr' ? 'fr-FR' : 'en-GB');

                    await createTranslatedNotification(
                        player.id,
                        'new_game_nearby',
                        'newGameNearby',
                        'newGameNearbyMessage',
                        { playerName: req.session.user.display_name, courseName: course.name, date: gameDate },
                        `/games/${game.id}`
                    );

                    // Push real-time notification
                    if (io) {
                        const t = translations[playerLang];
                        io.to(`user-${player.id}`).emit('new-notification', {
                            type: 'new_game_nearby',
                            title: t.notifications.newGameNearby,
                            message: t.notifications.newGameNearbyMessage
                                .replace('{playerName}', req.session.user.display_name)
                                .replace('{courseName}', course.name)
                                .replace('{date}', gameDate),
                            link: `/games/${game.id}`
                        });
                    }
                }

                console.log(`[games] Notified ${interestedPlayers.length} players about new game at ${course.name}`);
            }
        } catch (notifErr) {
            // Don't fail game creation if notifications fail
            console.error('Error sending new game notifications:', notifErr);
        }

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

// GET /games/:id/invite/:userId - Invite via link (must be before /:id route)
router.get('/:id/invite/:userId', isAuthenticated, requireLaunched, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const userId = parseInt(req.params.userId);
        console.log(`GET Invite request: game ${gameId}, user ${userId}, by ${req.session.user.display_name}`);

        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            console.log('Invite failed: unauthorized');
            req.session.error = 'Unauthorized';
            return res.redirect('/available');
        }

        // Get invited player info
        const User = require('../models/User');
        const invitedPlayer = await User.findById(userId);
        if (!invitedPlayer) {
            req.session.error = 'Player not found';
            return res.redirect('/available');
        }

        const inviteResult = await Game.invitePlayer(gameId, userId, req.session.user.id);
        console.log('Invite result:', inviteResult);

        // Notify invited player (in their language)
        await createTranslatedNotification(
            userId,
            'invitation',
            'gameInvitation',
            'youveBeenInvited',
            { playerName: req.session.user.display_name, courseName: game.course_name, date: new Date(game.game_date).toLocaleDateString() },
            `/games/${gameId}`
        );

        // Notify sender (confirmation, in their language)
        await createTranslatedNotification(
            req.session.user.id,
            'invitation_sent',
            'invitationSent',
            'invitationSentTo',
            { playerName: invitedPlayer.display_name, courseName: game.course_name },
            `/games/${gameId}`
        );

        // Push real-time notifications (use requester's language for socket, DB notification is in user's language)
        const io = req.app.get('io');
        if (io) {
            const invitedLang = await getUserLanguage(userId);
            const senderLang = req.lang || 'en';
            const tInvited = translations[invitedLang];
            const tSender = translations[senderLang];

            io.to(`user-${userId}`).emit('new-notification', {
                type: 'invitation',
                title: tInvited.notifications.gameInvitation,
                message: tInvited.notifications.youveBeenInvited.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name).replace('{date}', new Date(game.game_date).toLocaleDateString()),
                link: `/games/${gameId}`
            });
            io.to(`user-${req.session.user.id}`).emit('new-notification', {
                type: 'invitation_sent',
                title: tSender.notifications.invitationSent,
                message: tSender.notifications.invitationSentTo.replace('{playerName}', invitedPlayer.display_name).replace('{courseName}', game.course_name),
                link: `/games/${gameId}`
            });
        }

        req.session.success = `Invitation sent to ${invitedPlayer.display_name}!`;
        res.redirect('/available');

    } catch (err) {
        console.error('GET Invite player error:', err);
        req.session.error = 'Error inviting player';
        res.redirect('/available');
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
        let userInvited = false;
        let isCreator = false;
        let messages = [];

        if (req.session.user) {
            const userPlayer = players.find(p => p.user_id === req.session.user.id);
            userStatus = userPlayer?.status || null;
            userInvited = userPlayer?.invited_by ? true : false;
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
            userInvited,
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
router.post('/:id/join', isAuthenticated, requireLaunched, async (req, res) => {
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

        // Notify creator (in their language)
        await createTranslatedNotification(
            game.creator_id,
            'game_request',
            'newJoinRequest',
            'playerWantsToJoin',
            { playerName: req.session.user.display_name, courseName: game.course_name },
            `/games/${gameId}`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            const creatorLang = await getUserLanguage(game.creator_id);
            const t = translations[creatorLang];
            io.to(`user-${game.creator_id}`).emit('new-notification', {
                type: 'game_request',
                title: t.notifications.newJoinRequest,
                message: t.notifications.playerWantsToJoin.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name),
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

        // Notify player (in their language)
        await createTranslatedNotification(
            playerId,
            'game_accepted',
            'youreIn',
            'acceptedToGame',
            { courseName: game.course_name },
            `/games/${gameId}`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            const playerLang = await getUserLanguage(playerId);
            const t = translations[playerLang];
            io.to(`user-${playerId}`).emit('new-notification', {
                type: 'game_accepted',
                title: t.notifications.youreIn,
                message: t.notifications.acceptedToGame.replace('{courseName}', game.course_name),
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

        // Notify player (in their language)
        await createTranslatedNotification(
            playerId,
            'game_declined',
            'requestDeclined',
            'requestDeclinedMessage',
            { courseName: game.course_name },
            `/games`
        );

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            const playerLang = await getUserLanguage(playerId);
            const t = translations[playerLang];
            io.to(`user-${playerId}`).emit('new-notification', {
                type: 'game_declined',
                title: t.notifications.requestDeclined,
                message: t.notifications.requestDeclinedMessage.replace('{courseName}', game.course_name),
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

// POST /games/:id/accept-invite - Invited player accepts invitation
router.post('/:id/accept-invite', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games');
        }

        // Check if user was invited to this game
        const players = await Game.getPlayers(gameId);
        const userPlayer = players.find(p => p.user_id === req.session.user.id);

        if (!userPlayer || userPlayer.status !== 'pending' || !userPlayer.invited_by) {
            req.session.error = 'You were not invited to this game';
            return res.redirect(`/games/${gameId}`);
        }

        // Accept the invitation (reuse existing acceptPlayer method)
        await Game.acceptPlayer(gameId, req.session.user.id);

        // Notify the game creator (in their language)
        await createTranslatedNotification(
            game.creator_id,
            'invitation_accepted',
            'invitationAccepted',
            'playerAcceptedInvite',
            { playerName: req.session.user.display_name, courseName: game.course_name },
            `/games/${gameId}`
        );

        // Push real-time notification to creator
        const io = req.app.get('io');
        if (io) {
            const creatorLang = await getUserLanguage(game.creator_id);
            const tCreator = translations[creatorLang];
            io.to(`user-${game.creator_id}`).emit('new-notification', {
                type: 'invitation_accepted',
                title: tCreator.notifications.invitationAccepted,
                message: tCreator.notifications.playerAcceptedInvite.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name),
                link: `/games/${gameId}`
            });
        }

        // Notify the invited player (themselves) to confirm they can chat
        await createTranslatedNotification(
            req.session.user.id,
            'game_joined',
            'youreIn',
            'acceptedToGame',
            { courseName: game.course_name },
            `/games/${gameId}`
        );

        if (io) {
            const userLang = req.lang || 'en';
            const tUser = translations[userLang];
            io.to(`user-${req.session.user.id}`).emit('new-notification', {
                type: 'game_joined',
                title: tUser.notifications.youreIn,
                message: tUser.notifications.acceptedToGame.replace('{courseName}', game.course_name),
                link: `/games/${gameId}`
            });
        }

        req.session.success = 'You\'ve joined the game! You can now chat with the group.';
        res.redirect(`/games/${gameId}`);

    } catch (err) {
        console.error('Accept invite error:', err);
        req.session.error = 'Error accepting invitation';
        res.redirect('/games');
    }
});

// POST /games/:id/decline-invite - Invited player declines invitation
router.post('/:id/decline-invite', isAuthenticated, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const game = await Game.findById(gameId);

        if (!game) {
            req.session.error = 'Game not found';
            return res.redirect('/games');
        }

        // Check if user was invited to this game
        const players = await Game.getPlayers(gameId);
        const userPlayer = players.find(p => p.user_id === req.session.user.id);

        if (!userPlayer || userPlayer.status !== 'pending' || !userPlayer.invited_by) {
            req.session.error = 'You were not invited to this game';
            return res.redirect(`/games/${gameId}`);
        }

        // Decline the invitation (reuse existing declinePlayer method)
        await Game.declinePlayer(gameId, req.session.user.id);

        // Notify the game creator (in their language)
        await createTranslatedNotification(
            game.creator_id,
            'invitation_declined',
            'invitationDeclined',
            'playerDeclinedInvite',
            { playerName: req.session.user.display_name, courseName: game.course_name },
            `/games/${gameId}`
        );

        // Push real-time notification to creator
        const io = req.app.get('io');
        if (io) {
            const creatorLang = await getUserLanguage(game.creator_id);
            const t = translations[creatorLang];
            io.to(`user-${game.creator_id}`).emit('new-notification', {
                type: 'invitation_declined',
                title: t.notifications.invitationDeclined,
                message: t.notifications.playerDeclinedInvite.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name),
                link: `/games/${gameId}`
            });
        }

        req.session.success = 'Invitation declined';
        res.redirect('/games');

    } catch (err) {
        console.error('Decline invite error:', err);
        req.session.error = 'Error declining invitation';
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
            const io = req.app.get('io');

            // Notify the creator
            if (game.creator_id !== req.session.user.id) {
                await createTranslatedNotification(
                    game.creator_id,
                    'player_withdrawn',
                    'playerWithdrew',
                    'playerWithdrewMessage',
                    { playerName: req.session.user.display_name, courseName: game.course_name },
                    `/games/${gameId}`
                );

                // Push real-time notification
                if (io) {
                    const creatorLang = await getUserLanguage(game.creator_id);
                    const t = translations[creatorLang];
                    io.to(`user-${game.creator_id}`).emit('new-notification', {
                        type: 'player_withdrawn',
                        title: t.notifications.playerWithdrew,
                        message: t.notifications.playerWithdrewMessage.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name),
                        link: `/games/${gameId}`
                    });
                }
            }

            // Notify other accepted players
            for (const player of players) {
                if (player.user_id !== req.session.user.id &&
                    player.user_id !== game.creator_id &&
                    (player.status === 'accepted' || player.role === 'creator')) {
                    await createTranslatedNotification(
                        player.user_id,
                        'player_withdrawn',
                        'playerWithdrew',
                        'playerWithdrewMessage',
                        { playerName: req.session.user.display_name, courseName: game.course_name },
                        `/games/${gameId}`
                    );

                    // Push real-time notification
                    if (io) {
                        const playerLang = await getUserLanguage(player.user_id);
                        const t = translations[playerLang];
                        io.to(`user-${player.user_id}`).emit('new-notification', {
                            type: 'player_withdrawn',
                            title: t.notifications.playerWithdrew,
                            message: t.notifications.playerWithdrewMessage.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name),
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
                const playerLang = await getUserLanguage(player.user_id);
                const gameDate = new Date(game.game_date).toLocaleDateString(playerLang === 'fr' ? 'fr-FR' : 'en-GB');

                await createTranslatedNotification(
                    player.user_id,
                    'game_cancelled',
                    'gameCancelled',
                    'gameCancelledMessage',
                    { courseName: game.course_name, date: gameDate },
                    `/games`
                );

                // Push real-time notification
                if (io) {
                    const t = translations[playerLang];
                    io.to(`user-${player.user_id}`).emit('new-notification', {
                        type: 'game_cancelled',
                        title: t.notifications.gameCancelled,
                        message: t.notifications.gameCancelledMessage.replace('{courseName}', game.course_name).replace('{date}', gameDate),
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
router.post('/:id/invite/:userId', isAuthenticated, requireLaunched, async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const userId = parseInt(req.params.userId);
        console.log(`Invite request: game ${gameId}, user ${userId}, by ${req.session.user.display_name}`);

        const game = await Game.findById(gameId);

        if (!game || game.creator_id !== req.session.user.id) {
            console.log('Invite failed: unauthorized');
            req.session.error = 'Unauthorized';
            return res.redirect('/games');
        }

        const inviteResult = await Game.invitePlayer(gameId, userId, req.session.user.id);
        console.log('Invite result:', inviteResult);

        // Notify invited player (in their language)
        const notifResult = await createTranslatedNotification(
            userId,
            'invitation',
            'gameInvitation',
            'youveBeenInvited',
            { playerName: req.session.user.display_name, courseName: game.course_name, date: new Date(game.game_date).toLocaleDateString() },
            `/games/${gameId}`
        );
        console.log('Notification created:', notifResult);

        // Push real-time notification
        const io = req.app.get('io');
        if (io) {
            const invitedLang = await getUserLanguage(userId);
            const t = translations[invitedLang];
            io.to(`user-${userId}`).emit('new-notification', {
                type: 'invitation',
                title: t.notifications.gameInvitation,
                message: t.notifications.youveBeenInvited.replace('{playerName}', req.session.user.display_name).replace('{courseName}', game.course_name).replace('{date}', new Date(game.game_date).toLocaleDateString()),
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
