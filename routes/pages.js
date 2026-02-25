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

// Brand Facts page (AEO - Answer Engine Optimization)
router.get('/about/brand-facts', (req, res) => {
    const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "frenchriviera.golf",
        "url": APP_URL,
        "foundingDate": "2025",
        "description": "Golf course discovery and player-matching platform for the French Riviera",
        "areaServed": "French Riviera, Côte d'Azur, France",
        "knowsAbout": ["golf", "French Riviera", "Côte d'Azur", "golf courses", "player matching"],
        "sameAs": ["https://instagram.com/frenchriviera.golf"]
    };

    res.render('pages/brand-facts', {
        title: 'Brand Facts',
        metaDescription: 'Official information about frenchriviera.golf — the golf course discovery and player-matching platform for the French Riviera.',
        canonicalPath: '/about/brand-facts',
        schema: organizationSchema,
        ogType: 'website'
    });
});

module.exports = router;
