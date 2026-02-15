const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

// GET /blog - Blog index
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.findAll();

        const breadcrumbs = [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
            { "@type": "ListItem", "position": 2, "name": "Blog" }
        ];

        res.render('blog/index', {
            title: 'Golf Blog - Tips, Guides & News',
            posts,
            metaDescription: 'Expert golf tips, course guides, and news from the French Riviera. Discover the best golf experiences on the Côte d\'Azur.',
            canonicalPath: '/blog',
            keywords: 'french riviera golf blog, golf tips cote d azur, golf guides france, riviera golf news',
            breadcrumbs
        });
    } catch (err) {
        console.error('Blog error:', err);
        res.redirect('/');
    }
});

// GET /blog/:slug - Individual blog post
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findBySlug(req.params.slug);

        if (!post) {
            return res.redirect('/blog');
        }

        const recentPosts = await BlogPost.getRecent(5);

        const breadcrumbs = [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": APP_URL + '/blog' },
            { "@type": "ListItem", "position": 3, "name": post.title }
        ];

        // Article schema for rich snippets
        const schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "image": post.featured_image ? APP_URL + post.featured_image : APP_URL + '/images/og-default.png',
            "author": {
                "@type": "Organization",
                "name": post.author || "French Riviera Golf"
            },
            "publisher": {
                "@type": "Organization",
                "name": "French Riviera Golf",
                "logo": {
                    "@type": "ImageObject",
                    "url": APP_URL + "/images/logo.png"
                }
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at || post.published_at,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": APP_URL + '/blog/' + post.slug
            }
        };

        res.render('blog/post', {
            title: post.title,
            post,
            recentPosts,
            metaDescription: post.meta_description || post.excerpt,
            canonicalPath: '/blog/' + post.slug,
            ogImage: post.featured_image ? APP_URL + post.featured_image : null,
            keywords: `${post.title}, french riviera golf, ${post.category || 'golf tips'}`,
            breadcrumbs,
            schema
        });
    } catch (err) {
        console.error('Blog post error:', err);
        res.redirect('/blog');
    }
});

module.exports = router;
