const db = require('../config/database');

const LAUNCH_THRESHOLD = 100;
const FOUNDING_MEMBER_LIMIT = 100;

/**
 * Get the current launch status
 * @returns {Promise<{userCount: number, threshold: number, isLaunched: boolean, spotsLeft: number, foundingMemberSpotsLeft: number}>}
 */
async function getLaunchStatus() {
    try {
        const result = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE email_verified = true'
        );
        const userCount = parseInt(result.rows[0].count);

        return {
            userCount,
            threshold: LAUNCH_THRESHOLD,
            isLaunched: userCount >= LAUNCH_THRESHOLD,
            spotsLeft: Math.max(0, LAUNCH_THRESHOLD - userCount),
            foundingMemberSpotsLeft: Math.max(0, FOUNDING_MEMBER_LIMIT - userCount),
            progressPercent: Math.min(100, Math.round((userCount / LAUNCH_THRESHOLD) * 100))
        };
    } catch (err) {
        console.error('Error getting launch status:', err);
        // Default to launched if we can't check (fail open)
        return {
            userCount: LAUNCH_THRESHOLD,
            threshold: LAUNCH_THRESHOLD,
            isLaunched: true,
            spotsLeft: 0,
            foundingMemberSpotsLeft: 0,
            progressPercent: 100
        };
    }
}

/**
 * Check if a user should be marked as founding member
 * Call this when user verifies their email
 */
async function checkAndSetFoundingMember(userId) {
    try {
        const status = await getLaunchStatus();

        // If we haven't hit the founding member limit yet, mark them
        if (status.userCount <= FOUNDING_MEMBER_LIMIT) {
            await db.query(
                'UPDATE users SET is_founding_member = true WHERE id = $1',
                [userId]
            );
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error setting founding member:', err);
        return false;
    }
}

/**
 * Middleware to add launch status to all requests
 */
function launchStatusMiddleware(req, res, next) {
    getLaunchStatus().then(status => {
        req.launchStatus = status;
        res.locals.launchStatus = status;
        next();
    }).catch(err => {
        console.error('Launch status middleware error:', err);
        req.launchStatus = { isLaunched: true };
        res.locals.launchStatus = { isLaunched: true };
        next();
    });
}

/**
 * Middleware to require platform to be launched
 * Use on routes that should be locked until launch
 */
function requireLaunched(req, res, next) {
    if (req.launchStatus && req.launchStatus.isLaunched) {
        return next();
    }

    // Platform not launched yet
    req.session.error = req.lang === 'fr'
        ? `Cette fonctionnalité sera disponible quand nous atteindrons ${LAUNCH_THRESHOLD} membres. Plus que ${req.launchStatus?.spotsLeft || LAUNCH_THRESHOLD} places !`
        : `This feature unlocks when we reach ${LAUNCH_THRESHOLD} members. Only ${req.launchStatus?.spotsLeft || LAUNCH_THRESHOLD} spots left!`;

    return res.redirect('/dashboard');
}

module.exports = {
    LAUNCH_THRESHOLD,
    FOUNDING_MEMBER_LIMIT,
    getLaunchStatus,
    checkAndSetFoundingMember,
    launchStatusMiddleware,
    requireLaunched
};
