/**
 * Migration: Add is_admin column to users table
 * Run: node scripts/migrate-admin-role.js
 */

require('dotenv').config();
const db = require('../config/database');

async function migrate() {
    console.log('Starting admin role migration...');

    try {
        // Add is_admin column
        console.log('Adding is_admin column to users...');
        await db.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE
        `);

        // Set existing admin user (from hardcoded email)
        console.log('Setting admin flag for existing admin user...');
        await db.query(`
            UPDATE users
            SET is_admin = TRUE
            WHERE email = 'yachtphotographer@gmail.com'
        `);

        console.log('Migration completed successfully!');
        console.log('');
        console.log('Admin users can now be managed via database:');
        console.log('  - To add admin: UPDATE users SET is_admin = TRUE WHERE email = \'user@example.com\';');
        console.log('  - To remove admin: UPDATE users SET is_admin = FALSE WHERE id = X;');
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
