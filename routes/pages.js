const express = require('express');
const router = express.Router();

// About Us page
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About Us',
        metaDescription: 'French Riviera Golf connects golfers on the Côte d\'Azur. Find playing partners, join games, and discover the best courses from Monaco to Saint-Tropez.',
        canonicalPath: '/about'
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contact',
        metaDescription: 'Get in touch with French Riviera Golf. Questions about finding golf partners or courses on the Côte d\'Azur? We\'re here to help.',
        canonicalPath: '/contact'
    });
});

// Privacy Policy page
router.get('/privacy', (req, res) => {
    res.render('pages/privacy', {
        title: 'Privacy Policy',
        metaDescription: 'Privacy Policy for French Riviera Golf. Learn how we protect your data and respect your privacy.',
        canonicalPath: '/privacy'
    });
});

module.exports = router;
