require('dotenv').config({ quiet: true });
const { pool } = require('../config/database');
const courses = require('../data/courses-seed.json');

const seedCourses = async () => {
    const client = await pool.connect();

    try {
        console.log('Seeding courses...');

        for (const course of courses) {
            const columns = Object.keys(course);
            const values = Object.values(course);
            const placeholders = columns.map((_, i) => `$${i + 1}`);

            await client.query(
                `INSERT INTO courses (${columns.join(', ')})
                 VALUES (${placeholders.join(', ')})
                 ON CONFLICT (slug) DO UPDATE SET
                 ${columns.map((col, i) => `${col} = $${i + 1}`).join(', ')},
                 updated_at = NOW()`,
                values
            );
            console.log(`  - ${course.name}`);
        }

        console.log(`\nSeeded ${courses.length} courses successfully!`);

    } catch (err) {
        console.error('Error seeding courses:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
};

seedCourses().catch(console.error);
