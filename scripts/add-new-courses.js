require('dotenv').config();
const { pool } = require('../config/database');

const newCourses = [
    {
        name: "Dolce Fregate Provence",
        slug: "dolce-fregate-provence",
        city: "Saint-Cyr-sur-Mer",
        department: "83",
        department_name: "Var",
        holes: 18,
        par: 72,
        course_length_meters: 6050,
        architect: "Ronald Fream",
        year_opened: 1992,
        latitude: 43.1833,
        longitude: 5.7000,
        description_en: "Set within the prestigious Dolce Fregate Provence resort, this challenging 18-hole course offers stunning Mediterranean views and year-round playing conditions. Designed by Ronald Fream, the layout winds through Provençal landscapes with strategic bunkering and water features.",
        description_fr: "Situé au sein du prestigieux resort Dolce Fregate Provence, ce parcours de 18 trous offre des vues méditerranéennes époustouflantes. Conçu par Ronald Fream, le tracé serpente à travers des paysages provençaux avec des bunkers stratégiques et des obstacles d'eau.",
        driving_range: true,
        putting_green: true,
        buggy_available: true,
        trolley_available: true,
        club_rental: true,
        pro_shop: true,
        restaurant: true,
        hotel_onsite: true,
        swimming_pool: true,
        spa: true,
        photos: ["/images/courses/golf-dolcefregate.jpg"],
        featured: false,
        active: true
    },
    {
        name: "Golf Le Provençal",
        slug: "golf-le-provencal",
        city: "Biot",
        department: "06",
        department_name: "Alpes-Maritimes",
        holes: 9,
        par: 33,
        course_length_meters: 2400,
        latitude: 43.6300,
        longitude: 7.0500,
        description_en: "A charming 9-hole course nestled in the hills near Sophia Antipolis. Golf Le Provençal offers a relaxed atmosphere perfect for beginners and those seeking a quick round. The course features rolling terrain with views of the surrounding Mediterranean vegetation.",
        description_fr: "Un charmant parcours de 9 trous niché dans les collines près de Sophia Antipolis. Golf Le Provençal offre une atmosphère détendue, parfait pour les débutants et ceux qui cherchent une partie rapide. Le parcours présente un terrain vallonné avec des vues sur la végétation méditerranéenne.",
        driving_range: true,
        putting_green: true,
        buggy_available: true,
        trolley_available: true,
        club_rental: true,
        pro_shop: true,
        restaurant: true,
        photos: ["/images/courses/golf-le-provencal.jpg"],
        featured: false,
        active: true
    },
    {
        name: "Golf Blue Green Sainte-Maxime",
        slug: "golf-sainte-maxime",
        city: "Sainte-Maxime",
        department: "83",
        department_name: "Var",
        holes: 18,
        par: 71,
        course_length_meters: 5800,
        architect: "Donald Harradine",
        year_opened: 1989,
        latitude: 43.3200,
        longitude: 6.6400,
        description_en: "Overlooking the stunning Gulf of Saint-Tropez, Golf Blue Green Sainte-Maxime offers one of the most scenic golfing experiences on the French Riviera. The course winds through pine forests and cork oaks with breathtaking sea views from several holes.",
        description_fr: "Surplombant le magnifique Golfe de Saint-Tropez, Golf Blue Green Sainte-Maxime offre l'une des expériences de golf les plus pittoresques de la Côte d'Azur. Le parcours serpente à travers des forêts de pins et de chênes-lièges avec des vues mer époustouflantes.",
        driving_range: true,
        putting_green: true,
        chipping_green: true,
        buggy_available: true,
        trolley_available: true,
        club_rental: true,
        pro_shop: true,
        golf_lessons: true,
        restaurant: true,
        photos: ["/images/courses/golf-sainte-maxime.jpg"],
        featured: false,
        active: true
    },
    {
        name: "Golf de Victoria",
        slug: "golf-de-victoria",
        city: "Le Muy",
        department: "83",
        department_name: "Var",
        holes: 9,
        par: 36,
        course_length_meters: 3000,
        latitude: 43.4700,
        longitude: 6.5700,
        description_en: "A peaceful 9-hole course set among ancient olive groves and Provençal landscapes in the Var countryside. Golf de Victoria offers a relaxing golfing experience away from the coastal crowds, with gentle fairways and scenic views of the surrounding hills.",
        description_fr: "Un paisible parcours de 9 trous situé parmi d'anciennes oliveraies et des paysages provençaux dans la campagne du Var. Golf de Victoria offre une expérience de golf relaxante loin de la foule côtière, avec des fairways doux et des vues panoramiques.",
        driving_range: true,
        putting_green: true,
        buggy_available: true,
        trolley_available: true,
        club_rental: true,
        pro_shop: true,
        restaurant: true,
        photos: ["/images/courses/golf-victoria.jpg"],
        featured: false,
        active: true
    }
];

async function addNewCourses() {
    const client = await pool.connect();

    try {
        console.log('Adding new golf courses...\n');

        for (const course of newCourses) {
            const columns = Object.keys(course);
            const values = Object.values(course);
            const placeholders = columns.map((_, i) => `$${i + 1}`);

            const result = await client.query(
                `INSERT INTO courses (${columns.join(', ')})
                 VALUES (${placeholders.join(', ')})
                 ON CONFLICT (slug) DO UPDATE SET
                 ${columns.map((col, i) => `${col} = $${i + 1}`).join(', ')},
                 updated_at = NOW()
                 RETURNING name, slug`,
                values
            );

            if (result.rows.length > 0) {
                console.log(`✓ Added: ${result.rows[0].name} (${result.rows[0].slug})`);
            }
        }

        console.log('\nDone! New courses added to database.');

    } catch (err) {
        console.error('Error adding courses:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

addNewCourses();
