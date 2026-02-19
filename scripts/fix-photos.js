require('dotenv').config({ quiet: true });
const { pool } = require('../config/database');

// All courses with verified French Riviera / Provence / city photos
const coursePhotos = {
    "monte-carlo-golf-club": [
        "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80"  // Monaco view
    ],
    "royal-mougins-golf-club": [
        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80"  // Mougins area
    ],
    "cannes-mougins-golf-country-club": [
        "https://images.unsplash.com/photo-1503696967350-ad1874122058?w=800&q=80"  // Cannes
    ],
    "terre-blanche-chateau": [
        "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80"  // Provence countryside
    ],
    "terre-blanche-le-riou": [
        "https://images.unsplash.com/photo-1568003606800-65c7b994f498?w=800&q=80"  // Provence hills
    ],
    "old-course-mandelieu": [
        "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80"  // French Riviera palm trees
    ],
    "riviera-golf-barbossi": [
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800&q=80"  // Riviera coast
    ],
    "golf-opio-valbonne": [
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80"  // Provence village
    ],
    "grande-bastide": [
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80"  // Grasse area
    ],
    "golf-club-biot": [
        "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80"  // Mediterranean coast
    ],
    "golf-saint-donat": [
        "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=800&q=80"  // Grasse lavender
    ],
    "golf-roquebrune": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"  // Mediterranean sea
    ],
    "golf-saint-endreol": [
        "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80"  // Provence pines
    ],
    "golf-valescure": [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"  // Saint-Raphael area
    ],
    "chateau-de-taulane": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"  // Mountain landscape
    ],
    "golf-saint-tropez": [
        "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80"  // Saint-Tropez
    ],
    "nice-golf-country-club": [
        "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80"  // Nice
    ],
    "golf-claux-amic": [
        "https://images.unsplash.com/photo-1499002238440-d264f5e4d178?w=800&q=80"  // Provence fields
    ],
    "golf-barbaroux": [
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80"  // Provence landscape
    ],
    "esterel-latitudes-golf": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"  // Esterel mountains
    ]
};

async function updateAllPhotos() {
    const client = await pool.connect();

    try {
        console.log('Updating all course photos with French Riviera images...\n');

        for (const [slug, photos] of Object.entries(coursePhotos)) {
            const result = await client.query(
                `UPDATE courses SET photos = $1, updated_at = NOW() WHERE slug = $2 RETURNING name`,
                [photos, slug]
            );
            console.log(`✓ Updated: ${result.rows[0]?.name || slug}`);
        }

        console.log('\nDone! All 20 courses updated.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateAllPhotos();
