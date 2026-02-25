const express = require('express');
const router = express.Router();

// Course slug mapping for internal links
const courseLinks = {
    'terre-blanche': '/courses/terre-blanche-chateau',
    'royal-mougins': '/courses/royal-mougins-golf-club',
    'monte-carlo': '/courses/monte-carlo-golf-club',
    'cannes-mougins': '/courses/cannes-mougins-golf-country-club',
    'grande-bastide': '/courses/grande-bastide',
    'opio-valbonne': '/courses/golf-opio-valbonne',
    'saint-donat': '/courses/golf-saint-donat',
    'taulane': '/courses/chateau-de-taulane',
    'old-course': '/courses/old-course-mandelieu',
    'roquebrune': '/courses/golf-roquebrune',
    'biot': '/courses/golf-club-biot',
    'barbossi': '/courses/riviera-golf-barbossi',
    'saint-tropez': '/courses/golf-saint-tropez',
    'esterel': '/courses/esterel-latitudes-golf'
};

// Top 10 courses data for schema
const top10Courses = [
    {
        position: 1,
        name: 'Terre Blanche — Le Château',
        slug: 'terre-blanche-chateau',
        city: 'Tourrettes',
        holes: 18,
        par: 72,
        designer: 'Dave Thomas',
        greenFee: '€96-200+',
        description: 'The benchmark for Riviera golf. Two Dave Thomas-designed courses set across 300 hectares of Provençal woodland.'
    },
    {
        position: 2,
        name: 'Royal Mougins Golf Resort',
        slug: 'royal-mougins-golf-club',
        city: 'Mougins',
        holes: 18,
        par: 71,
        designer: 'Robert von Hagge',
        greenFee: '€95-165',
        description: 'A Robert von Hagge design tucked into the secluded Vallon de l\'Oeuf valley, just 10 minutes from Cannes.'
    },
    {
        position: 3,
        name: 'Monte-Carlo Golf Club',
        slug: 'monte-carlo-golf-club',
        city: 'La Turbie',
        holes: 18,
        par: 71,
        designer: 'Willie Park Jr.',
        greenFee: '€70-170',
        description: 'Perched at 900 metres above sea level, overlooking Monaco, France, and Italy simultaneously.'
    },
    {
        position: 4,
        name: 'Golf Country Club Cannes-Mougins',
        slug: 'cannes-mougins-golf-country-club',
        city: 'Mougins',
        holes: 18,
        par: 72,
        designer: 'Peter Alliss & Dave Thomas',
        greenFee: '€70-120',
        description: 'Founded in 1923 by Aga Khan, Prince Pierre de Monaco, and Baron de Rothschild.'
    },
    {
        position: 5,
        name: 'Golf de la Grande Bastide',
        slug: 'grande-bastide',
        city: 'Châteauneuf-de-Grasse',
        holes: 18,
        par: 72,
        designer: 'Cabell Robinson',
        greenFee: '€55-95',
        description: 'The best value championship course on the Riviera.'
    },
    {
        position: 6,
        name: 'Golf d\'Opio-Valbonne',
        slug: 'golf-opio-valbonne',
        city: 'Opio',
        holes: 18,
        par: 72,
        designer: 'Donald Harradine',
        greenFee: '€55-130',
        description: 'Set within a stunning 220-hectare protected estate surrounding the 17th-century Château de la Bégude.'
    },
    {
        position: 7,
        name: 'Golf de Saint-Donat',
        slug: 'golf-saint-donat',
        city: 'Grasse',
        holes: 18,
        par: 71,
        designer: 'Robert Trent Jones Jr.',
        greenFee: '€55-85',
        description: 'Set at the entrance to Grasse, the world\'s perfume capital.'
    },
    {
        position: 8,
        name: 'Château de Taulane',
        slug: 'chateau-de-taulane',
        city: 'La Martre',
        holes: 18,
        par: 72,
        designer: 'Gary Player',
        greenFee: '€70-130',
        description: 'Gary Player\'s only French design. A hidden gem at 1,000 metres altitude.'
    },
    {
        position: 9,
        name: 'Old Course Cannes-Mandelieu',
        slug: 'old-course-mandelieu',
        city: 'Mandelieu-la-Napoule',
        holes: 18,
        par: 71,
        designer: 'Henry Colt (1891)',
        greenFee: '€60-100',
        description: 'One of the oldest courses in continental Europe (1891), commissioned by Grand Duke Michael of Russia.'
    },
    {
        position: 10,
        name: 'Golf de Roquebrune',
        slug: 'golf-roquebrune',
        city: 'Roquebrune-sur-Argens',
        holes: 18,
        par: 72,
        designer: 'Various',
        greenFee: '€55-90',
        description: 'Located between Cannes and Saint-Tropez, overlooking the bay of Fréjus.'
    }
];

// FAQ data for schema
const faqData = [
    {
        question: 'What is the best golf course on the French Riviera?',
        answer: 'Terre Blanche (Le Château course) is widely considered the best golf course on the French Riviera and regularly ranks among France\'s top 10. It offers the highest standard of course conditioning, facilities, and service in the region. For a more traditional experience, Cannes-Mougins has the deepest history. For the best views, Monte-Carlo Golf Club is unmatched.'
    },
    {
        question: 'How many golf courses are on the French Riviera?',
        answer: 'There are over 20 golf courses on the French Riviera (Côte d\'Azur), concentrated between Monaco in the east and Saint-Tropez in the west. Most are located in the hills behind the coast, typically 20-45 minutes from the seafront. The majority are 18-hole courses, with a few 9-hole options for shorter rounds.'
    },
    {
        question: 'What do green fees cost on the French Riviera?',
        answer: 'Green fees on the French Riviera range from approximately €55 to €200+ depending on the course, season, and day of the week. Budget-friendly courses like Grande Bastide and Opio-Valbonne start around €55 in low season. Premium courses like Terre Blanche and Royal Mougins range from €95 to €200. Most courses offer reduced rates in winter (November-March) and for afternoon tee times in summer.'
    },
    {
        question: 'Can I play golf on the French Riviera year-round?',
        answer: 'Yes. The French Riviera enjoys a Mediterranean climate with 300+ days of sunshine per year. Golf is playable every month, though the most comfortable playing conditions are in spring (April-June) and autumn (September-November). Summer (July-August) can be hot, with many courses offering reduced afternoon rates. Winter is mild (10-15°C) and courses are quiet — many golfers consider it the best-kept secret for off-season Riviera golf.'
    },
    {
        question: 'How do I find golf playing partners on the French Riviera?',
        answer: 'frenchriviera.golf is a free platform specifically designed to connect golfers on the Côte d\'Azur. You can create a game listing (specifying course, date, time, and how many players you need) or mark yourself as available so other golfers can invite you. The platform serves residents, expats, yacht guests, and visitors alike.'
    },
    {
        question: 'Is a buggy / golf cart required on French Riviera courses?',
        answer: 'Policies vary by course. Terre Blanche requires a cart in summer (included in the green fee year-round). Royal Mougins includes a cart in all green fees. Most other courses offer optional cart rental (typically €30-45). Grande Bastide, Opio-Valbonne, and Saint-Donat are all walkable. The Old Course Mandelieu is completely flat — no cart needed. Monte-Carlo and Taulane are hilly enough that a cart is strongly recommended.'
    },
    {
        question: 'Which French Riviera golf courses are closest to Nice airport?',
        answer: 'The closest courses to Nice Côte d\'Azur airport are: Golf de Biot (20 min), Golf Country Club de Nice (15 min, 9 holes), Opio-Valbonne (30 min), Grande Bastide (25 min), and Cannes-Mougins (35 min). You can realistically land at Nice airport and be on the first tee within 45 minutes.'
    },
    {
        question: 'Can I combine a golf trip with a yacht charter on the French Riviera?',
        answer: 'Absolutely — the French Riviera is one of the few places where world-class golf and world-class yachting coexist within minutes of each other. Courses near the major yachting ports of Antibes, Cannes, and Saint-Tropez are all accessible for a half-day excursion from the boat.'
    }
];

// GET /guides/best-golf-courses-french-riviera-2026
router.get('/best-golf-courses-french-riviera-2026', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        // Build ItemList schema for ranked courses
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Best Golf Courses on the French Riviera 2026",
            "description": "Ranked guide to the top 10 golf courses on the Côte d'Azur, France",
            "numberOfItems": top10Courses.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": top10Courses.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": course.city,
                        "addressRegion": "Provence-Alpes-Côte d'Azur",
                        "addressCountry": "FR"
                    },
                    "numberOfHoles": course.holes,
                    "architect": {
                        "@type": "Person",
                        "name": course.designer
                    }
                }
            }))
        };

        // Build FAQPage schema
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        // Article schema for the guide itself
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best Golf Courses on the French Riviera (2026 Guide)",
            "description": "Ranked guide to 20+ golf courses on the Côte d'Azur. Green fees, comparisons, reviews, and free player matching. Updated 2026.",
            "image": `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            "author": {
                "@type": "Organization",
                "name": "French Riviera Golf",
                "url": APP_URL
            },
            "publisher": {
                "@type": "Organization",
                "name": "French Riviera Golf",
                "url": APP_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${APP_URL}/images/logo.png`
                }
            },
            "datePublished": "2026-02-01",
            "dateModified": "2026-02-25",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${APP_URL}/guides/best-golf-courses-french-riviera-2026`
            }
        };

        // Breadcrumbs
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": APP_URL
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Guides",
                "item": `${APP_URL}/guides`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Best Golf Courses French Riviera 2026"
            }
        ];

        res.render('guides/best-golf-courses', {
            title: 'Best Golf Courses on the French Riviera (2026 Guide)',
            metaDescription: 'Ranked guide to 20+ golf courses on the Côte d\'Azur. Green fees, comparisons, reviews, and free player matching. Updated 2026.',
            canonicalPath: '/guides/best-golf-courses-french-riviera-2026',
            ogImage: `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            ogType: 'article',
            keywords: 'best golf courses french riviera, golf cote d azur, golf monaco, golf cannes, golf nice, terre blanche, royal mougins, monte carlo golf, french riviera golf guide 2026',
            breadcrumbs,
            schema: [itemListSchema, faqSchema, articleSchema],
            top10Courses,
            faqData,
            courseLinks
        });

    } catch (err) {
        console.error('Guide page error:', err);
        req.session.error = 'Error loading guide';
        res.redirect('/');
    }
});

// Guides index (optional - redirect to main guide for now)
router.get('/', (req, res) => {
    res.redirect('/guides/best-golf-courses-french-riviera-2026');
});

module.exports = router;
