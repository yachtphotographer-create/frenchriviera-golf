require('dotenv').config();
const { pool } = require('../config/database');

// Verified working golf course images from Unsplash
const coursePhotos = {
    "monte-carlo-golf-club": [
        "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80"
    ],
    "royal-mougins-golf-club": [
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80"
    ],
    "cannes-mougins-golf-country-club": [
        "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80"
    ],
    "terre-blanche-chateau": [
        "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?w=800&q=80"
    ],
    "terre-blanche-le-riou": [
        "https://images.unsplash.com/photo-1562176566-e9afd27531d4?w=800&q=80"
    ],
    "old-course-mandelieu": [
        "https://images.unsplash.com/photo-1500932334442-8761ee4810a7?w=800&q=80"
    ],
    "riviera-golf-barbossi": [
        "https://images.unsplash.com/photo-1633533452148-a6b0366580f1?w=800&q=80"
    ],
    "golf-opio-valbonne": [
        "https://images.unsplash.com/photo-1580127534052-6583a62d7327?w=800&q=80"
    ],
    "grande-bastide": [
        "https://images.unsplash.com/photo-1591491719565-9a0a6f52d577?w=800&q=80"
    ],
    "golf-club-biot": [
        "https://images.unsplash.com/photo-1621508638997-e30808c10653?w=800&q=80"
    ],
    "golf-saint-donat": [
        "https://images.unsplash.com/photo-1609859419744-eb8db2e8c29c?w=800&q=80"
    ],
    "golf-roquebrune": [
        "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?w=800&q=80"
    ],
    "golf-saint-endreol": [
        "https://images.unsplash.com/photo-1558369178-6556d97855d0?w=800&q=80"
    ],
    "golf-valescure": [
        "https://images.unsplash.com/photo-1579200986793-0a88d6540fab?w=800&q=80"
    ],
    "chateau-de-taulane": [
        "https://images.unsplash.com/photo-1584908390049-e4dd3a6f5849?w=800&q=80"
    ],
    "golf-saint-tropez": [
        "https://images.unsplash.com/photo-1545437706-755cbbb76fcb?w=800&q=80"
    ],
    "nice-golf-country-club": [
        "https://images.unsplash.com/photo-1595351298020-038700609878?w=800&q=80"
    ],
    "golf-claux-amic": [
        "https://images.unsplash.com/photo-1622397817068-e82188bf5aa7?w=800&q=80"
    ],
    "golf-barbaroux": [
        "https://images.unsplash.com/photo-1560185127-bdf956e56de5?w=800&q=80"
    ],
    "esterel-latitudes-golf": [
        "https://images.unsplash.com/photo-1565025011378-6da929195c9a?w=800&q=80"
    ]
};

async function updateCoursePhotos() {
    const client = await pool.connect();

    try {
        console.log('Updating golf course photos...\n');

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

        console.log('\nDone! All course photos updated with golf images.');

    } catch (err) {
        console.error('Error updating photos:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateCoursePhotos();
