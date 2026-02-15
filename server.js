require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sessionConfig = require('./config/session');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Trust proxy (for HTTPS behind Nginx)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://www.google-analytics.com", "wss:"],
            frameSrc: ["https://www.googletagmanager.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

// Share session with Socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Make user and notifications available to all templates
app.use(async (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.appName = process.env.APP_NAME || 'French Riviera Golf';
    res.locals.appUrl = process.env.APP_URL || 'http://localhost:3000';

    // Get unread notifications count
    if (req.session.user) {
        const { getUnreadCount } = require('./utils/notifications');
        res.locals.unreadNotifications = await getUnreadCount(req.session.user.id);
    } else {
        res.locals.unreadNotifications = 0;
    }

    next();
});

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const coursesRoutes = require('./routes/courses');
const gamesRoutes = require('./routes/games');
const availabilityRoutes = require('./routes/availability');
const ratingsRoutes = require('./routes/ratings');
const notificationsRoutes = require('./routes/notifications');
const sitemapRoutes = require('./routes/sitemap');

app.use('/auth', authLimiter, authRoutes);
app.use('/profile', profileRoutes);
app.use('/courses', coursesRoutes);
app.use('/games', gamesRoutes);
app.use('/availability', availabilityRoutes);
app.use('/available', availabilityRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/', sitemapRoutes);

// Home page
app.get('/', async (req, res) => {
    const db = require('./config/database');
    try {
        const result = await db.query(
            'SELECT * FROM courses WHERE featured = true AND active = true ORDER BY name LIMIT 6'
        );
        const APP_URL = process.env.APP_URL || "https://frenchriviera.golf";

        // Combined schemas for homepage
        const homeSchemas = [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "French Riviera Golf",
                "url": APP_URL,
                "description": "Find golf partners on the French Riviera. Connect with players, join games, discover courses.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": APP_URL + "/courses?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "SportsActivityLocation",
                "name": "French Riviera Golf",
                "description": "Golf player matching platform for the French Riviera and Côte d'Azur",
                "url": APP_URL,
                "sport": "Golf",
                "areaServed": {
                    "@type": "Place",
                    "name": "French Riviera",
                    "address": {
                        "@type": "PostalAddress",
                        "addressRegion": "Provence-Alpes-Côte d'Azur",
                        "addressCountry": "FR"
                    }
                }
            }
        ];

        res.render('home', {
            title: 'Find Golf Partners on the French Riviera',
            featuredCourses: result.rows,
            metaDescription: 'Connect with fellow golfers on the French Riviera. Find playing partners, join games at 20+ courses from Monaco to Saint-Tropez. Free to join.',
            canonicalPath: '/',
            keywords: 'golf partners french riviera, find golfers cote d azur, golf buddies france, play golf monaco, golf cannes nice, tee time partners',
            schema: homeSchemas
        });
    } catch (err) {
        console.error('Error loading home page:', err);
        res.render('home', {
            title: 'Find Golf Partners on the French Riviera',
            featuredCourses: []
        });
    }
});

// Dashboard (authenticated)
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        req.session.error = 'Please log in to access the dashboard';
        return res.redirect('/auth/login');
    }

    try {
        const Game = require('./models/Game');
        const Rating = require('./models/Rating');

        const games = await Game.findByPlayer(req.session.user.id);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const upcomingGames = games.filter(g => new Date(g.game_date) >= now && g.player_status === 'accepted').slice(0, 3);

        // Get games to rate
        const gamesToRate = await Rating.getGamesToRate(req.session.user.id);

        res.render('dashboard', {
            title: 'Dashboard',
            upcomingGames,
            gamesToRate
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.render('dashboard', { title: 'Dashboard', upcomingGames: [], gamesToRate: [] });
    }
});

// Socket.io for chat
io.on('connection', (socket) => {
    const session = socket.request.session;

    if (!session.user) {
        socket.disconnect();
        return;
    }

    console.log(`User ${session.user.display_name} connected to chat`);

    // Join a game chat room
    socket.on('join-game', (gameId) => {
        socket.join(`game-${gameId}`);
        console.log(`User ${session.user.display_name} joined game-${gameId}`);
    });

    // Leave a game chat room
    socket.on('leave-game', (gameId) => {
        socket.leave(`game-${gameId}`);
    });

    // Handle new message
    socket.on('send-message', async (data) => {
        const { gameId, content } = data;

        if (!content || !content.trim()) return;

        try {
            const Message = require('./models/Message');
            const Game = require('./models/Game');

            // Check if user is in the game
            const player = await Game.isPlayerInGame(gameId, session.user.id);
            if (!player || player.status !== 'accepted') {
                return;
            }

            // Save message
            const message = await Message.create({
                game_id: gameId,
                sender_id: session.user.id,
                content: content.trim()
            });

            // Get message with sender info
            const fullMessage = await Message.getWithSender(message.id);

            // Broadcast to all users in the game room
            io.to(`game-${gameId}`).emit('new-message', {
                id: fullMessage.id,
                content: fullMessage.content,
                sender_id: fullMessage.sender_id,
                display_name: fullMessage.display_name,
                profile_photo: fullMessage.profile_photo,
                created_at: fullMessage.created_at
            });

        } catch (err) {
            console.error('Error sending message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${session.user.display_name} disconnected`);
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('layouts/main', {
        title: 'Page Not Found',
        body: '<div class="container"><h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p><a href="/">Go Home</a></div>'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('layouts/main', {
        title: 'Error',
        body: '<div class="container"><h1>Something went wrong</h1><p>Please try again later.</p><a href="/">Go Home</a></div>'
    });
});

server.listen(PORT, () => {
    console.log(`French Riviera Golf running on http://localhost:${PORT}`);
});
