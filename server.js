require('dotenv').config({ quiet: true });

const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { doubleCsrf } = require('csrf-csrf');
const sessionConfig = require('./config/session');
const languageMiddleware = require('./middleware/language');
const { escapeHtml } = require('./utils/security');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Make io available to routes
app.set('io', io);

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
    max: process.env.NODE_ENV !== 'production' ? 1000 : 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV !== 'production' ? 100 : 10, // More lenient in development
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware - Static files with caching
const isDev = process.env.NODE_ENV !== 'production';
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isDev ? 0 : '7d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        if (isDev) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            return;
        }
        // Longer cache for images in production
        if (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.svg') || filePath.endsWith('.webp')) {
            res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
        }
        // Shorter cache for CSS/JS in production (versioned via ?v=)
        if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

// CSRF Protection
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.SESSION_SECRET || 'csrf-secret-change-me',
    cookieName: '__csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    },
    getCsrfTokenFromRequest: (req) => req.body._csrf || req.headers['x-csrf-token'],
    // Use empty string to avoid session ID mismatch when saveUninitialized is false
    // The double-submit cookie pattern already provides CSRF protection without session binding
    getSessionIdentifier: () => ''
});

// Apply CSRF protection to all routes except Socket.io and static files
app.use((req, res, next) => {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    // Apply CSRF protection for state-changing requests
    doubleCsrfProtection(req, res, next);
});

// Language middleware (must be after cookie-parser)
app.use(languageMiddleware);

// Share session with Socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Make user, notifications, CSRF token, and escape helper available to all templates
app.use(async (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.appName = process.env.APP_NAME || 'French Riviera Golf';
    res.locals.appUrl = process.env.APP_URL || 'http://localhost:3000';

    // Generate CSRF token for forms
    res.locals.csrfToken = generateCsrfToken(req, res);

    // Make escapeHtml available in templates
    res.locals.escapeHtml = escapeHtml;

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

// Serve .well-known directory (for brand-facts.json, etc.)
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known'), {
    dotfiles: 'allow',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        }
    }
}));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const coursesRoutes = require('./routes/courses');
const gamesRoutes = require('./routes/games');
const availabilityRoutes = require('./routes/availability');
const ratingsRoutes = require('./routes/ratings');
const notificationsRoutes = require('./routes/notifications');
const sitemapRoutes = require('./routes/sitemap');
const blogRoutes = require('./routes/blog');
const cityRoutes = require('./routes/cities');
const pagesRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const guidesRoutes = require('./routes/guides');

app.use('/auth', authLimiter, authRoutes);
app.use('/profile', profileRoutes);
app.use('/courses', coursesRoutes);
app.use('/games', gamesRoutes);
app.use('/availability', availabilityRoutes);
app.use('/available', availabilityRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/blog', blogRoutes);
app.use('/guides', guidesRoutes);
app.use('/', cityRoutes);
app.use('/', sitemapRoutes);
app.use('/', pagesRoutes);
app.use('/admin', adminRoutes);

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
                "description": "Golf player matching platform for the French Riviera and Cote d'Azur",
                "url": APP_URL,
                "sport": "Golf",
                "areaServed": {
                    "@type": "Place",
                    "name": "French Riviera",
                    "address": {
                        "@type": "PostalAddress",
                        "addressRegion": "Provence-Alpes-Cote d'Azur",
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
        const User = require('./models/User');

        // Fetch fresh user data with stats
        const freshUser = await User.findById(req.session.user.id);
        if (freshUser) {
            req.session.user.games_played = freshUser.games_played || 0;
            req.session.user.average_rating = freshUser.average_rating || null;
        }

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

// Socket.io for chat and notifications
io.on('connection', (socket) => {
    const session = socket.request.session;

    if (!session.user) {
        socket.disconnect();
        return;
    }

    console.log(`User ${session.user.display_name} connected to chat`);

    // Join personal notification room
    socket.join(`user-${session.user.id}`);

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

            // Check if user is in the game (accepted or creator)
            const player = await Game.isPlayerInGame(gameId, session.user.id);
            if (!player || (player.status !== 'accepted' && player.role !== 'creator')) {
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

            // Create database notifications for other players in the game
            try {
                const Notification = require('./models/Notification');
                const gamePlayers = await Game.getPlayers(gameId);

                for (const p of gamePlayers) {
                    // Don't notify the sender
                    if (p.user_id !== session.user.id && (p.status === 'accepted' || p.role === 'creator')) {
                        const notification = await Notification.create({
                            user_id: p.user_id,
                            type: 'new_message',
                            title: `New message from ${session.user.display_name}`,
                            message: content.trim().substring(0, 100),
                            link: `/games/${gameId}`
                        });

                        // Push real-time notification to user
                        io.to(`user-${p.user_id}`).emit('new-notification', {
                            id: notification.id,
                            type: notification.type,
                            title: notification.title,
                            message: notification.message,
                            link: notification.link
                        });
                    }
                }
            } catch (notifErr) {
                console.error('Error creating chat notifications:', notifErr);
            }

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
    console.log(`404 - Page not found: ${req.method} ${req.originalUrl}`);
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        canonicalPath: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    // Generate error ID for tracking
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    // Log with error ID for debugging
    console.error(`[Error ${errorId}] ${req.method} ${req.originalUrl}`);
    console.error(`[Error ${errorId}] ${err.stack}`);

    // Handle CSRF errors specifically - redirect back with error message
    if (err.code === 'EBADCSRFTOKEN' || err.message === 'invalid csrf token') {
        req.session.error = 'Form expired. Please try again.';
        const referer = req.get('Referer') || '/';
        return res.redirect(referer);
    }

    // Try to render error page, fall back to plain text if template fails
    try {
        res.status(500).render('errors/500', {
            title: 'Error',
            errorId: errorId,
            canonicalPath: req.path,
            appName: res.locals.appName || process.env.APP_NAME || 'French Riviera Golf',
            appUrl: res.locals.appUrl || process.env.APP_URL || 'http://localhost:3000',
            user: res.locals.user || null,
            unreadNotifications: res.locals.unreadNotifications || 0,
            csrfToken: res.locals.csrfToken || '',
            lang: res.locals.lang || 'en',
            t: res.locals.t || require('./locales/en.json'),
            htmlLang: res.locals.htmlLang || 'en',
            success: null,
            error: null
        });
    } catch (renderErr) {
        console.error(`[Error ${errorId}] Error page render failed:`, renderErr.message);
        res.status(500).send(`<h1>Server Error</h1><p>Error ID: ${errorId}</p><p><a href="/">Back to Home</a></p>`);
    }
});

server.listen(PORT, () => {
    console.log(`French Riviera Golf running on http://localhost:${PORT}`);
});
