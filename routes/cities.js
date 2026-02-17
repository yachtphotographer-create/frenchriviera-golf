const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// City configuration with SEO content
const cityConfig = {
    'nice': {
        name: 'Nice',
        cities: ['Nice'],
        department: '06',
        heroImage: '/images/cities/nice.jpg',
        description: `Nice, the capital of the French Riviera, offers golfers a perfect blend of Mediterranean lifestyle and world-class golf. Just minutes from the famous Promenade des Anglais, you'll find courses that combine stunning sea views with challenging play.`,
        highlights: [
            'Year-round Mediterranean climate',
            'Easy access from Nice Côte d\'Azur Airport',
            'Combine golf with city exploration',
            'Beautiful coastal scenery'
        ],
        nearbyAreas: ['monaco', 'cannes'],
        coordinates: { lat: 43.7102, lng: 7.2620 }
    },
    'monaco': {
        name: 'Monaco',
        cities: ['La Turbie'],
        department: '06',
        heroImage: '/images/cities/monaco.jpg',
        description: `Golf near Monaco offers an exclusive experience befitting the principality's glamorous reputation. The Monte-Carlo Golf Club, perched at 900m altitude in La Turbie, provides breathtaking panoramic views of Monaco and the Mediterranean Sea.`,
        highlights: [
            'Historic Monte-Carlo Golf Club (1911)',
            'Panoramic views of Monaco and the sea',
            'Altitude course with cooler summer temperatures',
            'Close to Monaco\'s luxury amenities'
        ],
        nearbyAreas: ['nice', 'cannes'],
        coordinates: { lat: 43.7384, lng: 7.4246 }
    },
    'cannes': {
        name: 'Cannes',
        cities: ['Mougins', 'Mandelieu-La-Napoule', 'Opio', 'Châteauneuf-Grasse'],
        department: '06',
        heroImage: '/images/cities/cannes.jpg',
        description: `The Cannes area is the golf capital of the French Riviera, with more courses than any other region. From the legendary Cannes-Mougins (host to 14 European Tour events) to the Robert Trent Jones masterpieces, this area offers unparalleled variety and quality.`,
        highlights: [
            'Largest concentration of courses on the Riviera',
            'Multiple European Tour host venues',
            'Courses by legendary architects',
            'Year-round golfing weather'
        ],
        nearbyAreas: ['nice', 'saint-tropez', 'grasse'],
        coordinates: { lat: 43.5528, lng: 7.0174 }
    },
    'saint-tropez': {
        name: 'Saint-Tropez',
        cities: ['Gassin', 'Roquebrune-sur-Argens', 'La Motte'],
        department: '83',
        heroImage: '/images/cities/saint-tropez.jpg',
        description: `Golf near Saint-Tropez combines the glamour of the famous resort town with exceptional courses in the Var department. Gary Player-designed courses and stunning Provençal landscapes make this area a must-visit for discerning golfers.`,
        highlights: [
            'Gary Player designed courses',
            'Stunning views of the Maures massif',
            'Combine golf with Saint-Tropez lifestyle',
            'Quieter, more exclusive atmosphere'
        ],
        nearbyAreas: ['cannes', 'grasse'],
        coordinates: { lat: 43.2677, lng: 6.6407 }
    },
    'grasse': {
        name: 'Grasse & Valbonne',
        cities: ['Châteauneuf-Grasse', 'Biot', 'Grasse', 'Opio'],
        department: '06',
        heroImage: '/images/cities/grasse.jpg',
        description: `The Grasse and Valbonne area, known as the perfume capital of the world, offers some of the French Riviera's most scenic inland golf courses. Rolling hills, ancient olive groves, and Mediterranean vegetation create a unique golfing environment.`,
        highlights: [
            'Scenic hillside courses',
            'Robert Trent Jones Jr. designs',
            'Less crowded than coastal courses',
            'Authentic Provençal atmosphere'
        ],
        nearbyAreas: ['cannes', 'nice'],
        coordinates: { lat: 43.6588, lng: 6.9203 }
    }
};

// GET /golf-in-:city - City landing page
router.get('/golf-in-:city', async (req, res) => {
    try {
        const citySlug = req.params.city.toLowerCase();
        const config = cityConfig[citySlug];

        if (!config) {
            req.session.error = 'City not found';
            return res.redirect('/courses');
        }

        // Get courses in this city/area
        const courses = await Course.getByCities(config.cities);

        // Build Schema.org structured data
        const schema = {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": `Golf in ${config.name}`,
            "description": config.description,
            "url": `${process.env.APP_URL || 'https://frenchriviera.golf'}/golf-in-${citySlug}`,
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": config.coordinates.lat,
                "longitude": config.coordinates.lng
            },
            "touristType": ["Golf tourism", "Sports tourism"],
            "includesAttraction": courses.map(course => ({
                "@type": "GolfCourse",
                "name": course.name,
                "url": `${process.env.APP_URL || 'https://frenchriviera.golf'}/courses/${course.slug}`
            }))
        };

        // ItemList schema for courses
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Golf Courses in ${config.name}`,
            "description": `Complete list of golf courses near ${config.name} on the French Riviera`,
            "numberOfItems": courses.length,
            "itemListElement": courses.map((course, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${process.env.APP_URL || 'https://frenchriviera.golf'}/courses/${course.slug}`,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": course.city,
                        "addressRegion": course.department_name,
                        "addressCountry": "FR"
                    }
                }
            }))
        };

        // Breadcrumbs
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.APP_URL || 'https://frenchriviera.golf'
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Golf Courses",
                "item": (process.env.APP_URL || 'https://frenchriviera.golf') + '/courses'
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": `Golf in ${config.name}`
            }
        ];

        // Get nearby cities for linking
        const nearbyCities = config.nearbyAreas.map(slug => ({
            slug,
            name: cityConfig[slug]?.name || slug
        }));

        // FAQPage schema for city pages
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `How many golf courses are there in ${config.name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `There are ${courses.length} golf courses in the ${config.name} area of the French Riviera.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `What is the best time to play golf in ${config.name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `The best time to play golf in ${config.name} is from April to June and September to November when the weather is pleasant and courses are in excellent condition.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Can I find playing partners in ${config.name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Yes! French Riviera Golf connects golfers looking for playing partners in ${config.name}. You can join open games or post your availability to find others.`
                    }
                }
            ]
        };

        // Default OG image (city-specific if available, fallback to default)
        const ogImage = (process.env.APP_URL || 'https://frenchriviera.golf') + '/images/og-default.png';

        res.render('courses/city-landing', {
            title: `Golf in ${config.name} - French Riviera Golf Courses`,
            cityName: config.name,
            citySlug,
            config,
            courses,
            nearbyCities,
            metaDescription: `Discover ${courses.length} golf courses in ${config.name} on the French Riviera. ${config.description.substring(0, 100)}...`,
            canonicalPath: `/golf-in-${citySlug}`,
            ogImage,
            keywords: `golf ${config.name.toLowerCase()}, golf courses ${config.name.toLowerCase()}, ${config.name.toLowerCase()} golf club, golf french riviera ${config.name.toLowerCase()}, tee times ${config.name.toLowerCase()}, golf holidays ${config.name.toLowerCase()}`,
            breadcrumbs,
            schema: [schema, itemListSchema, faqSchema]
        });

    } catch (err) {
        console.error('City landing error:', err);
        req.session.error = 'Error loading city page';
        res.redirect('/courses');
    }
});

// Export city config for sitemap
router.getCityConfig = () => cityConfig;

module.exports = router;
