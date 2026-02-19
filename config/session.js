const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./database');

const sessionConfig = {
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (reduced from 30)
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' // Stricter CSRF protection
    }
};

module.exports = sessionConfig;
