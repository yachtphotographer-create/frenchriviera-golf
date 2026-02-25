const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');

const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

// Helper to build XML sitemap from URLs array
function buildSitemapXml(urls) {
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
    return xml;
}

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

// GET /sitemap_index.xml - Sitemap index referencing individual sitemaps
router.get('/sitemap_index.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Main pages sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${APP_URL}/sitemap-main.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Courses sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${APP_URL}/sitemap-courses.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Cities sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${APP_URL}/sitemap-cities.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Blog sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${APP_URL}/sitemap-blog.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Guides sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${APP_URL}/sitemap-guides.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';

    xml += '</sitemapindex>';

    res.set('Content-Type', 'application/xml');
    res.send(xml);
});

// GET /sitemap-main.xml - Main/static pages
router.get('/sitemap-main.xml', (req, res) => {
    const urls = [
        { loc: '/', changefreq: 'daily', priority: '1.0' },
        { loc: '/courses', changefreq: 'weekly', priority: '0.9' },
        { loc: '/guides/best-golf-courses-french-riviera-2026', changefreq: 'monthly', priority: '0.9' },
        { loc: '/games', changefreq: 'daily', priority: '0.8' },
        { loc: '/available', changefreq: 'daily', priority: '0.7' },
        { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
        { loc: '/auth/login', changefreq: 'monthly', priority: '0.5' },
        { loc: '/auth/register', changefreq: 'monthly', priority: '0.5' },
        { loc: '/sitemap', changefreq: 'monthly', priority: '0.3' }
    ];

    res.set('Content-Type', 'application/xml');
    res.send(buildSitemapXml(urls));
});

// GET /sitemap-courses.xml - All golf course pages
router.get('/sitemap-courses.xml', async (req, res) => {
    try {
        const courses = await Course.findAll();
        const urls = courses.map(course => ({
            loc: `/courses/${course.slug}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: course.updated_at ? new Date(course.updated_at).toISOString().split('T')[0] : null
        }));

        res.set('Content-Type', 'application/xml');
        res.send(buildSitemapXml(urls));
    } catch (err) {
        console.error('Courses sitemap error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// GET /sitemap-cities.xml - City landing pages
router.get('/sitemap-cities.xml', (req, res) => {
    const urls = [
        { loc: '/golf-in-nice', changefreq: 'weekly', priority: '0.85' },
        { loc: '/golf-in-monaco', changefreq: 'weekly', priority: '0.85' },
        { loc: '/golf-in-cannes', changefreq: 'weekly', priority: '0.85' },
        { loc: '/golf-in-saint-tropez', changefreq: 'weekly', priority: '0.85' },
        { loc: '/golf-in-grasse', changefreq: 'weekly', priority: '0.85' }
    ];

    res.set('Content-Type', 'application/xml');
    res.send(buildSitemapXml(urls));
});

// GET /sitemap-guides.xml - Guide pages
router.get('/sitemap-guides.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const urls = [
        { loc: '/guides/best-golf-courses-french-riviera-2026', changefreq: 'monthly', priority: '0.9', lastmod: today }
    ];

    res.set('Content-Type', 'application/xml');
    res.send(buildSitemapXml(urls));
});

// GET /sitemap-blog.xml - Blog posts
router.get('/sitemap-blog.xml', async (req, res) => {
    try {
        const blogPosts = await BlogPost.findAll();
        const urls = blogPosts.map(post => ({
            loc: `/blog/${post.slug}`,
            changefreq: 'monthly',
            priority: '0.6',
            lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : null
        }));

        res.set('Content-Type', 'application/xml');
        res.send(buildSitemapXml(urls));
    } catch (err) {
        console.error('Blog sitemap error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// GET /sitemap.xml - Legacy combined sitemap (redirects to index for backwards compatibility)
router.get('/sitemap.xml', async (req, res) => {
    try {
        const courses = await Course.findAll();

        const urls = [
            // Static pages
            { loc: '/', changefreq: 'daily', priority: '1.0' },
            { loc: '/courses', changefreq: 'weekly', priority: '0.9' },
            { loc: '/guides/best-golf-courses-french-riviera-2026', changefreq: 'monthly', priority: '0.9' },
            { loc: '/games', changefreq: 'daily', priority: '0.8' },
            { loc: '/available', changefreq: 'daily', priority: '0.7' },
            { loc: '/auth/login', changefreq: 'monthly', priority: '0.5' },
            { loc: '/auth/register', changefreq: 'monthly', priority: '0.5' },
            // City landing pages
            { loc: '/golf-in-nice', changefreq: 'weekly', priority: '0.85' },
            { loc: '/golf-in-monaco', changefreq: 'weekly', priority: '0.85' },
            { loc: '/golf-in-cannes', changefreq: 'weekly', priority: '0.85' },
            { loc: '/golf-in-saint-tropez', changefreq: 'weekly', priority: '0.85' },
            { loc: '/golf-in-grasse', changefreq: 'weekly', priority: '0.85' },
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

        // Add blog posts
        const blogPosts = await BlogPost.findAll();
        urls.push({ loc: '/blog', changefreq: 'weekly', priority: '0.7' });
        blogPosts.forEach(post => {
            urls.push({
                loc: `/blog/${post.slug}`,
                changefreq: 'monthly',
                priority: '0.6',
                lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : null
            });
        });

        res.set('Content-Type', 'application/xml');
        res.send(buildSitemapXml(urls));

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
Sitemap: ${APP_URL}/sitemap_index.xml
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
