// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.error = 'Please log in to access this page';
    res.redirect('/auth/login');
};

// Check if user's email is verified
const isVerified = (req, res, next) => {
    if (req.session.user && req.session.user.email_verified) {
        return next();
    }
    req.session.error = 'Please verify your email to access this feature';
    res.redirect('/profile');
};

// Redirect if already logged in
const isGuest = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    isAuthenticated,
    isVerified,
    isGuest
};
