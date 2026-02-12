const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

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
    const robots = `User-agent: *
Allow: /

Sitemap: ${APP_URL}/sitemap.xml
`;
    res.set('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;
