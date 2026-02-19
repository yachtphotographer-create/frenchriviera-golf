/**
 * Migration: Add gender and birth_date to users, gender_preference to games
 * Run: node scripts/migrate-gender.js
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

        // Add gender column to users
        console.log('Adding gender column to users...');
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS gender VARCHAR(10)
            CHECK (gender IN ('male', 'female', 'other'))
        `);

        // Add birth_date column to users
        console.log('Adding birth_date column to users...');
        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS birth_date DATE
        `);

        // Add gender_preference column to games
        console.log('Adding gender_preference column to games...');
        await client.query(`
            ALTER TABLE games
            ADD COLUMN IF NOT EXISTS gender_preference VARCHAR(10)
            CHECK (gender_preference IN ('mixed', 'male', 'female'))
        `);

        // Set default for existing games
        console.log('Setting default gender_preference for existing games...');
        await client.query(`
            UPDATE games SET gender_preference = 'mixed' WHERE gender_preference IS NULL
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
