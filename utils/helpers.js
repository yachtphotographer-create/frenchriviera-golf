// Generate URL-friendly slug
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

// Format date for display
const formatDate = (date, locale = 'en-GB') => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

// Format time for display
const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

// Calculate average rating
const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return (sum / ratings.length).toFixed(2);
};

// Generate verification token
const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

// Truncate text with ellipsis
const truncate = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
};

// Get time window label
const getTimeWindowLabel = (timeWindow) => {
    const labels = {
        'early_bird': 'Early Bird (before 8am)',
        'morning': 'Morning (8am - 12pm)',
        'afternoon': 'Afternoon (after 12pm)',
        'all_day': 'All Day'
    };
    return labels[timeWindow] || timeWindow;
};

// Get playing level label
const getPlayingLevelLabel = (level) => {
    const labels = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'scratch': 'Scratch'
    };
    return labels[level] || level;
};

module.exports = {
    generateSlug,
    formatDate,
    formatTime,
    calculateAverageRating,
    generateToken,
    truncate,
    getTimeWindowLabel,
    getPlayingLevelLabel
};
