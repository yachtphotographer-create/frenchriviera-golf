require('dotenv').config({ quiet: true });
const db = require('../config/database');

async function createBlogTable() {
    console.log('Creating blog_posts table...\n');

    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS blog_posts (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            category VARCHAR(100),
            featured_image VARCHAR(500),
            meta_description VARCHAR(320),
            author VARCHAR(100) DEFAULT 'French Riviera Golf',
            published BOOLEAN DEFAULT false,
            published_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
        CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
    `;

    try {
        await db.query(createTableSQL);
        console.log('✓ blog_posts table created successfully');
    } catch (err) {
        console.error('Error creating table:', err.message);
    }

    process.exit(0);
}

createBlogTable();
