const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

// GET /sitemap - HTML sitemap for users
router.get('/sitemap', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.render('sitemap', {
            title: 'Sitemap',
            courses,
            metaDescription: 'Complete sitemap of French Riviera Golf - find all golf courses, pages, and resources on our site.',
            canonicalPath: '/sitemap'
        });
    } catch (err) {
        console.error('Sitemap error:', err);
        res.redirect('/');
    }
});

// GET /sitemap.xml - Dynamic sitemap
router.get('/sitemap.xml', async (req, res) => {
    try {
        const courses = await Course.findAll();

        const urls = [
            // Static pages
            { loc: '/', changefreq: 'daily', priority: '1.0' },
            { loc: '/courses', changefreq: 'weekly', priority: '0.9' },
            { loc: '/games', changefreq: 'daily', priority: '0.8' },
            { loc: '/available', changefreq: 'daily', priority: '0.7' },
            { loc: '/auth/login', changefreq: 'monthly', priority: '0.5' },
            { loc: '/auth/register', changefreq: 'monthly', priority: '0.5' },
        ];

        // Add course pages
        courses.forEach(course => {
            urls.push({
                loc: `/courses/${course.slug}`,
                changefreq: 'weekly',
                priority: '0.8',
                lastmod: course.updated_at ? new Date(course.updated_at).toISOString().split('T')[0] : null
            });
        });

        // Build XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${APP_URL}${url.loc}</loc>\n`;
            if (url.lastmod) {
                xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            }
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.set('Content-Type', 'application/xml');
        res.send(xml);

    } catch (err) {
        console.error('Sitemap error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// GET /robots.txt - Robots file
router.get('/robots.txt', (req, res) => {
    const robots = `# French Riviera Golf - robots.txt
# https://frenchriviera.golf

User-agent: *
Allow: /

# Block admin and private areas
Disallow: /auth/reset-password
Disallow: /auth/verify
Disallow: /profile/edit
Disallow: /notifications
Disallow: /api/

# Block search result pages with parameters
Disallow: /*?search=
Disallow: /*?department=

# Crawl-delay for politeness
Crawl-delay: 1

# Sitemaps
Sitemap: ${APP_URL}/sitemap.xml

# Google specific
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing specific
User-agent: Bingbot
Allow: /
Crawl-delay: 1
`;
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;
