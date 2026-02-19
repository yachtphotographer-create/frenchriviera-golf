require('dotenv').config({ quiet: true });
const db = require('../config/database');

const courseContacts = [
    {
        slug: "monte-carlo-golf-club",
        phone: "+33 4 92 41 50 70",
        email: "monte-carlo-golf-club@wanadoo.fr",
        website: "https://golfdemontecarlo.com/",
        address: "Route du Mont Agel, 06320 La Turbie, France"
    },
    {
        slug: "royal-mougins-golf-club",
        phone: "+33 4 92 92 49 69",
        email: "play@royalmougins.fr",
        website: "https://www.royalmougins.fr",
        address: "424 Avenue du Roi, 06250 Mougins, France"
    },
    {
        slug: "cannes-mougins-golf-country-club",
        phone: "+33 4 93 75 79 13",
        email: "contact@golfcannesmougins.com",
        website: "https://www.golfcannesmougins.com",
        address: "175 Avenue du Golf, 06250 Mougins, France"
    },
    {
        slug: "terre-blanche-chateau",
        phone: "+33 4 94 39 90 00",
        email: "reservation@terre-blanche.com",
        website: "https://www.terre-blanche.com",
        address: "3100 Route de Bagnols-en-Foret, 83440 Tourrettes, France"
    },
    {
        slug: "terre-blanche-le-riou",
        phone: "+33 4 94 39 90 00",
        email: "reservation@terre-blanche.com",
        website: "https://www.terre-blanche.com",
        address: "3100 Route de Bagnols-en-Foret, 83440 Tourrettes, France"
    },
    {
        slug: "old-course-mandelieu",
        phone: "+33 4 92 97 32 00",
        email: "contact@golfoldcourse.fr",
        website: "https://www.golfoldcourse.com",
        address: "265 Route du Golf, 06210 Mandelieu-la-Napoule, France"
    },
    {
        slug: "riviera-golf-barbossi",
        phone: "+33 4 92 97 49 49",
        email: "rivieragolf@ddeb.fr",
        website: "https://www.domainedebarbossi.fr",
        address: "802 Avenue des Amazones, 06210 Mandelieu-La-Napoule, France"
    },
    {
        slug: "golf-opio-valbonne",
        phone: "+33 4 93 12 00 08",
        email: "opiovalbonne@opengolfclub.com",
        website: "https://www.opiovalbonnegolfresort.com",
        address: "Route de Roquefort les Pins, 06650 Opio, France"
    },
    {
        slug: "grande-bastide",
        phone: "+33 4 93 77 70 08",
        email: "grandebastide@resonance.golf",
        website: "https://www.golfgrandebastide.com",
        address: "761 Chemin des Picholines, 06740 Chateauneuf-Grasse, France"
    },
    {
        slug: "golf-club-biot",
        phone: "+33 4 93 65 08 48",
        email: "golf.club.de.biot@wanadoo.fr",
        website: "https://www.golfdebiot.fr",
        address: "1379 Route d'Antibes, 06410 Biot, France"
    },
    {
        slug: "golf-saint-donat",
        phone: "+33 4 93 09 76 60",
        email: "info@golfsaintdonat.com",
        website: "https://golfsaintdonat.com",
        address: "270 Route de Cannes, 06130 Grasse, France"
    },
    {
        slug: "golf-roquebrune",
        phone: "+33 4 94 19 60 35",
        email: "roquebrune@resonance.golf",
        website: "https://www.golfderoquebrune.com",
        address: "1308 Route du Golf, 83520 Roquebrune-sur-Argens, France"
    },
    {
        slug: "golf-saint-endreol",
        phone: "+33 4 94 51 89 89",
        email: "accueil.golf@st-endreol.com",
        website: "https://st-endreol.com",
        address: "4300 Route de Bagnols-en-Foret, 83920 La Motte, France"
    },
    {
        slug: "golf-valescure",
        phone: "+33 4 94 82 40 46",
        email: "valescure@ugolf.eu",
        website: "https://www.golfdevalescure.com",
        address: "725 Avenue des Golfs, 83700 Saint-Raphael, France"
    },
    {
        slug: "chateau-de-taulane",
        phone: "+33 4 93 60 31 30",
        email: "resagolf@chateau-taulane.com",
        website: "https://www.chateau-taulane.com",
        address: "36 Impasse de Taulane - Le Logis du Pin, 83840 La Martre, France"
    },
    {
        slug: "golf-saint-tropez",
        phone: "+33 4 94 55 13 44",
        email: "proshop@golfclubsainttropez.com",
        website: "https://golfclubsainttropez.com",
        address: "600 Route du Golf, 83580 Gassin, France"
    },
    {
        slug: "nice-golf-country-club",
        phone: "+33 4 93 29 82 00",
        email: "sebastiao.golfdenice@yahoo.fr",
        website: "https://www.golf-club-nice.com",
        address: "698 Route de Grenoble, 06200 Nice, France"
    },
    {
        slug: "golf-claux-amic",
        phone: "+33 4 93 60 55 44",
        email: "reservation@claux-amic.com",
        website: "https://www.claux-amic.fr",
        address: "1 Route des 3 Ponts, 06130 Grasse, France"
    },
    {
        slug: "golf-barbaroux",
        phone: "+33 4 94 69 63 63",
        email: "contact@barbaroux.com",
        website: "https://www.barbaroux.com",
        address: "Route de Cabasse, 83170 Brignoles, France"
    },
    {
        slug: "esterel-latitudes-golf",
        phone: "+33 4 94 52 68 42",
        email: "restau.esterel@bluegreen.fr",
        website: "https://garrigae.fr/en/etablissements/domaine-de-lesterel/",
        address: "745 Boulevard Darby, 83700 Saint-Raphael, France"
    }
];

async function updateCourseContacts() {
    console.log('Updating golf course contact information...\n');

    for (const course of courseContacts) {
        try {
            const result = await db.query(
                `UPDATE courses
                 SET phone = $1, email = $2, website = $3, address = $4, updated_at = NOW()
                 WHERE slug = $5
                 RETURNING name`,
                [course.phone, course.email, course.website, course.address, course.slug]
            );

            if (result.rows.length > 0) {
                console.log(`Updated: ${result.rows[0].name}`);
            } else {
                console.log(`Not found: ${course.slug}`);
            }
        } catch (err) {
            console.error(`Error updating ${course.slug}:`, err.message);
        }
    }

    console.log('\nDone!');
    process.exit(0);
}

updateCourseContacts();
