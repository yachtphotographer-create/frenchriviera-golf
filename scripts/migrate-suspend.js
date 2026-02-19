/**
 * Migration: Add suspended column to users
 * Run: node scripts/migrate-suspend.js
 */

require('dotenv').config({ quiet: true });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    const client = await pool.connect();

    try {
        console.log('Starting migration...');

        // Add suspended column to users
        console.log('Adding suspended column to users...');
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE
        `);

        // Add suspended_at timestamp
        console.log('Adding suspended_at column to users...');
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ
        `);

        // Add suspended_reason
        console.log('Adding suspended_reason column to users...');
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS suspended_reason TEXT
        `);

        console.log('Migration completed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

migrate().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
});
