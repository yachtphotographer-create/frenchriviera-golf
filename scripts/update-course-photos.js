require('dotenv').config();
const db = require('../config/database');

const photoUpdates = [
    { slug: 'esterel-latitudes-golf', photo: '/images/courses/golf-esterel-latitudes-new.jpg' },
    { slug: 'golf-claux-amic', photo: '/images/courses/golf-claux-amic-new.jpg' },
    { slug: 'golf-club-biot', photo: '/images/courses/golf-biot-new.jpg' },
    { slug: 'cannes-mougins-golf-country-club', photo: '/images/courses/golf-cannes-mougins-new.jpg' },
    { slug: 'golf-roquebrune', photo: '/images/courses/golf-roquebrune.jpg' },
    { slug: 'golf-saint-tropez', photo: '/images/courses/golf-saint-tropez.jpg' },
    { slug: 'golf-valescure', photo: '/images/courses/golf-valescure.jpg' },
    { slug: 'monte-carlo-golf-club', photo: '/images/courses/golf-monte-carlo-new.jpg' },
    { slug: 'nice-golf-country-club', photo: '/images/courses/golf-nice-new.jpg' },
    { slug: 'old-course-mandelieu', photo: '/images/courses/golf-old-course-mandelieu-new.png' },
    { slug: 'riviera-golf-barbossi', photo: '/images/courses/golf-barbossi-new.jpg' },
    { slug: 'royal-mougins-golf-club', photo: '/images/courses/golf-royal-mougins.jpg' },
    { slug: 'terre-blanche-chateau', photo: '/images/courses/golf-terre-blanche-chateau.jpg' },
    { slug: 'terre-blanche-le-riou', photo: '/images/courses/golf-terre-blanche-riou.jpg' },
    { slug: 'golf-dolcefregate', photo: '/images/courses/golf-dolcefregate-new.jpg' },
    { slug: 'chateau-de-taulane', photo: '/images/courses/golf-chateau-taulane-new.webp' }
];

async function updatePhotos() {
    try {
        for (const update of photoUpdates) {
            const result = await db.query(
                "UPDATE courses SET photos = ARRAY[\$1] WHERE slug = \$2 RETURNING name, slug",
                [update.photo, update.slug]
            );

            if (result.rows.length > 0) {
                console.log("Updated:", result.rows[0].name);
            } else {
                console.log("Not found:", update.slug);
            }
        }

        console.log("\nAll photos updated!");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

updatePhotos();
