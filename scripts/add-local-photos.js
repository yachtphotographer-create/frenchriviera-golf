require('dotenv').config();
const { pool } = require('../config/database');

// Map local photo files to course slugs
const coursePhotos = {
    "golf-barbaroux": ["/images/courses/golf-de-barbaroux.jpg"],
    "golf-saint-donat": ["/images/courses/golf-de-saint-donat.jpg"],
    "golf-saint-endreol": ["/images/courses/golf-saint-endreol.jpg"],
    "grande-bastide": ["/images/courses/golf-grande-bastide.jpg"],
    "golf-opio-valbonne": ["/images/courses/golf-opio-valbonne.jpg"],
    "royal-mougins-golf-club": ["/images/courses/golf-royal-mougins.jpg"],
    // These courses may need to be added to the database:
    // "golf-dolcefregate": ["/images/courses/golf-dolcefregate.jpg"],
    // "golf-le-provencal": ["/images/courses/golf-le-provencal.jpg"],
    // "golf-sainte-maxime": ["/images/courses/golf-sainte-maxime.jpg"],
    // "golf-victoria": ["/images/courses/golf-victoria.jpg"],
};

async function updateCoursePhotos() {
    const client = await pool.connect();

    try {
        console.log('Updating golf course photos with local images...\n');

        // First, list all existing courses
        const allCourses = await client.query('SELECT slug, name FROM courses ORDER BY name');
        console.log('Existing courses in database:');
        allCourses.rows.forEach(c => console.log(`  - ${c.slug}: ${c.name}`));
        console.log('\n');

        for (const [slug, photos] of Object.entries(coursePhotos)) {
            const result = await client.query(
                `UPDATE courses
                 SET photos = $1, updated_at = NOW()
                 WHERE slug = $2
                 RETURNING name`,
                [photos, slug]
            );

            if (result.rows.length > 0) {
                console.log(`✓ Updated: ${result.rows[0].name}`);
            } else {
                console.log(`✗ Not found: ${slug}`);
            }
        }

        console.log('\nDone! Course photos updated with local images.');

    } catch (err) {
        console.error('Error updating photos:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateCoursePhotos();
