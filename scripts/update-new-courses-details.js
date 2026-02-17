require('dotenv').config();
const { pool } = require('../config/database');

const courseUpdates = [
    {
        slug: "dolce-fregate-provence",
        address: "Lieu dit Fregate, RD 559, 83270 Saint-Cyr-sur-Mer",
        phone: "+33 4 94 29 38 00",
        email: "golf-fregate@dolce.com",
        website: "https://www.lefregateprovence.com/"
    },
    {
        slug: "golf-le-provencal",
        address: "95 Avenue de Roumanille, 06410 Biot",
        phone: "+33 4 93 00 00 57",
        email: null,
        website: "https://www.leprovencalgolf.com/"
    },
    {
        slug: "golf-sainte-maxime",
        address: "Route du Débarquement, BP1, 83120 Sainte-Maxime",
        phone: "+33 4 94 55 02 02",
        email: "ste.maxime@bluegreen.com",
        website: "https://bluegreen.fr/sainte-maxime/"
    },
    {
        // Victoria is actually in Valbonne, not Le Muy - correcting location
        slug: "golf-de-victoria",
        city: "Valbonne",
        department: "06",
        department_name: "Alpes-Maritimes",
        address: "1475 Chemin du Val Martin, 06560 Valbonne",
        phone: "+33 4 93 12 23 26",
        email: "victoriagolfclub@wanadoo.fr",
        website: "https://www.victoria-golfclub.com",
        latitude: 43.6350,
        longitude: 7.0150,
        par: 34,
        architect: "Michel Gayon"
    }
];

async function updateCourses() {
    const client = await pool.connect();

    try {
        console.log('Updating course details...\n');

        for (const course of courseUpdates) {
            const { slug, ...updates } = course;

            const setClauses = Object.keys(updates)
                .map((key, i) => `${key} = $${i + 2}`)
                .join(', ');

            const values = [slug, ...Object.values(updates)];

            const result = await client.query(
                `UPDATE courses
                 SET ${setClauses}, updated_at = NOW()
                 WHERE slug = $1
                 RETURNING name`,
                values
            );

            if (result.rows.length > 0) {
                console.log(`✓ Updated: ${result.rows[0].name}`);
                Object.entries(updates).forEach(([key, val]) => {
                    if (val) console.log(`    ${key}: ${val}`);
                });
            } else {
                console.log(`✗ Not found: ${slug}`);
            }
            console.log('');
        }

        console.log('Done!');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateCourses();
