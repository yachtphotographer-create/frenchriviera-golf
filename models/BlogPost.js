const db = require('../config/database');

const BlogPost = {
    // Get all published posts (optionally filtered by language)
    async findAll(limit = 20, language = null) {
        let query = `SELECT * FROM blog_posts WHERE published = true`;
        const params = [];
        let paramIndex = 1;

        if (language) {
            query += ` AND language = $${paramIndex}`;
            params.push(language);
            paramIndex++;
        }

        query += ` ORDER BY published_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        const result = await db.query(query, params);
        return result.rows;
    },

    // Find post by slug
    async findBySlug(slug) {
        const result = await db.query(
            `SELECT * FROM blog_posts
             WHERE slug = $1 AND published = true`,
            [slug]
        );
        return result.rows[0];
    },

    // Get recent posts for sidebar (optionally filtered by language)
    async getRecent(limit = 5, language = null) {
        let query = `SELECT slug, title, published_at FROM blog_posts WHERE published = true`;
        const params = [];
        let paramIndex = 1;

        if (language) {
            query += ` AND language = $${paramIndex}`;
            params.push(language);
            paramIndex++;
        }

        query += ` ORDER BY published_at DESC LIMIT $${paramIndex}`;
        params.push(limit);

        const result = await db.query(query, params);
        return result.rows;
    },

    // Get posts by category
    async findByCategory(category) {
        const result = await db.query(
            `SELECT * FROM blog_posts
             WHERE category = $1 AND published = true
             ORDER BY published_at DESC`,
            [category]
        );
        return result.rows;
    },

    // Create post
    async create(postData) {
        const { slug, title, excerpt, content, category, featured_image, meta_description, author } = postData;
        const result = await db.query(
            `INSERT INTO blog_posts (slug, title, excerpt, content, category, featured_image, meta_description, author, published, published_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
             RETURNING *`,
            [slug, title, excerpt, content, category, featured_image, meta_description, author]
        );
        return result.rows[0];
    }
};

module.exports = BlogPost;
