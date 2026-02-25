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

// Top 10 courses data for schema (English)
const top10CoursesEN = [
    { position: 1, name: 'Terre Blanche — Le Château', slug: 'terre-blanche-chateau', city: 'Tourrettes', region: 'Var', holes: 18, par: 72, designer: 'Dave Thomas', greenFee: '€96-200+', rating: '4.8', description: 'The benchmark for Riviera golf. Two Dave Thomas-designed courses set across 300 hectares of Provençal woodland.' },
    { position: 2, name: 'Royal Mougins Golf Resort', slug: 'royal-mougins-golf-club', city: 'Mougins', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Robert von Hagge', greenFee: '€95-165', rating: '4.7', description: 'A Robert von Hagge design tucked into the secluded Vallon de l\'Oeuf valley.' },
    { position: 3, name: 'Monte-Carlo Golf Club', slug: 'monte-carlo-golf-club', city: 'La Turbie', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Willie Park Jr.', greenFee: '€70-170', rating: '4.6', description: 'Perched at 900 metres above sea level, overlooking Monaco, France, and Italy.' },
    { position: 4, name: 'Golf Country Club Cannes-Mougins', slug: 'cannes-mougins-golf-country-club', city: 'Mougins', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Peter Alliss & Dave Thomas', greenFee: '€80-150', rating: '4.5', description: 'Founded in 1923, hosted 14 European Tour events.' },
    { position: 5, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-de-Grasse', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Cabell Robinson', greenFee: '€55-95', rating: '4.4', description: 'The best value championship course on the Riviera.' },
    { position: 6, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Donald Harradine', greenFee: '€55-130', rating: '4.3', description: 'Set within a stunning 220-hectare protected estate.' },
    { position: 7, name: 'Golf de Saint-Donat', slug: 'golf-saint-donat', city: 'Grasse', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Robert Trent Jones Jr.', greenFee: '€55-85', rating: '4.0', description: 'Set at the entrance to Grasse, the world\'s perfume capital.' },
    { position: 8, name: 'Château de Taulane', slug: 'chateau-de-taulane', city: 'La Martre', region: 'Var', holes: 18, par: 72, designer: 'Gary Player', greenFee: '€60-100', rating: '4.5', description: 'Gary Player\'s only French design at 1,000 metres altitude.' },
    { position: 9, name: 'Old Course Cannes-Mandelieu', slug: 'old-course-mandelieu', city: 'Mandelieu-la-Napoule', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Grand Duke Michael (1891)', greenFee: '€70-130', rating: '4.2', description: 'One of the oldest courses in continental Europe (1891).' },
    { position: 10, name: 'Golf de Roquebrune', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', region: 'Var', holes: 18, par: 72, designer: 'Various', greenFee: '€50-90', rating: '4.1', description: 'Located between Cannes and Saint-Tropez.' }
];

// Top 10 courses data for schema (French)
const top10CoursesFR = [
    { position: 1, name: 'Terre Blanche — Le Château', slug: 'terre-blanche-chateau', city: 'Tourrettes', region: 'Var', holes: 18, par: 72, designer: 'Dave Thomas', greenFee: '96–200+ €', rating: '4.8', description: 'Le complexe cinq étoiles de référence sur la Riviera.' },
    { position: 2, name: 'Royal Mougins Golf Resort', slug: 'royal-mougins-golf-club', city: 'Mougins', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Robert von Hagge', greenFee: '95–165 €', rating: '4.7', description: 'Parcours de championship signé Robert von Hagge.' },
    { position: 3, name: 'Monte-Carlo Golf Club', slug: 'monte-carlo-golf-club', city: 'La Turbie', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Willie Park Jr.', greenFee: '70–170 €', rating: '4.6', description: 'Parcours historique perché à 900 mètres d\'altitude.' },
    { position: 4, name: 'Cannes-Mougins Country Club', slug: 'cannes-mougins-golf-country-club', city: 'Mougins', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Peter Alliss & Dave Thomas', greenFee: '80–150 €', rating: '4.5', description: 'L\'un des clubs les plus réputés de la Côte d\'Azur.' },
    { position: 5, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-Grasse', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Cabell Robinson', greenFee: '55–95 €', rating: '4.4', description: 'Le meilleur rapport qualité-prix de la région.' },
    { position: 6, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', region: 'Alpes-Maritimes', holes: 18, par: 72, designer: 'Donald Harradine', greenFee: '55–130 €', rating: '4.3', description: 'Domaine de 220 hectares avec château historique.' },
    { position: 7, name: 'Golf de Saint-Donat', slug: 'golf-saint-donat', city: 'Grasse', region: 'Alpes-Maritimes', holes: 9, par: 33, designer: 'N/A', greenFee: '35–55 €', rating: '4.0', description: 'Parcours de montagne au-dessus de Grasse.' },
    { position: 8, name: 'Golf de Taulane', slug: 'chateau-de-taulane', city: 'La Martre', region: 'Var', holes: 18, par: 72, designer: 'Gary Player', greenFee: '60–100 €', rating: '4.5', description: 'Joyau caché conçu par Gary Player.' },
    { position: 9, name: 'Old Course de Cannes-Mandelieu', slug: 'old-course-mandelieu', city: 'Mandelieu-la-Napoule', region: 'Alpes-Maritimes', holes: 18, par: 71, designer: 'Grand-Duc Michel (1891)', greenFee: '70–130 €', rating: '4.2', description: 'Le plus ancien golf de Côte d\'Azur, fondé en 1891.' },
    { position: 10, name: 'Golf de Roquebrune', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', region: 'Var', holes: 18, par: 72, designer: 'Divers', greenFee: '50–90 €', rating: '4.1', description: 'Parcours boisé entre Fréjus et Sainte-Maxime.' }
];

// FAQ data (English)
const faqDataEN = [
    { question: 'What is the best golf course on the French Riviera?', answer: 'Terre Blanche (Le Château course) is widely considered the best golf course on the French Riviera and regularly ranks among France\'s top 10. It offers the highest standard of course conditioning, facilities, and service in the region. For a more traditional experience, Cannes-Mougins has the deepest history. For the best views, Monte-Carlo Golf Club is unmatched.' },
    { question: 'How many golf courses are on the French Riviera?', answer: 'There are over 20 golf courses on the French Riviera (Côte d\'Azur), concentrated between Monaco in the east and Saint-Tropez in the west. Most are located in the hills behind the coast, typically 20-45 minutes from the seafront.' },
    { question: 'What do green fees cost on the French Riviera?', answer: 'Green fees on the French Riviera range from approximately €55 to €200+ depending on the course, season, and day of the week. Budget-friendly courses like Grande Bastide and Opio-Valbonne start around €55 in low season. Premium courses like Terre Blanche and Royal Mougins range from €95 to €200.' },
    { question: 'Can I play golf on the French Riviera year-round?', answer: 'Yes. The French Riviera enjoys a Mediterranean climate with 300+ days of sunshine per year. Golf is playable every month, though the most comfortable playing conditions are in spring (April-June) and autumn (September-November).' },
    { question: 'How do I find golf playing partners on the French Riviera?', answer: 'frenchriviera.golf is a free platform specifically designed to connect golfers on the Côte d\'Azur. You can create a game listing or mark yourself as available so other golfers can invite you.' },
    { question: 'Is a buggy / golf cart required on French Riviera courses?', answer: 'Policies vary by course. Terre Blanche requires a cart in summer (included in the green fee year-round). Royal Mougins includes a cart in all green fees. Most other courses offer optional cart rental (typically €30-45).' },
    { question: 'Which French Riviera golf courses are closest to Nice airport?', answer: 'The closest courses to Nice Côte d\'Azur airport are: Golf de Biot (20 min), Golf Country Club de Nice (15 min, 9 holes), Opio-Valbonne (30 min), Grande Bastide (25 min), and Cannes-Mougins (35 min).' },
    { question: 'Can I combine a golf trip with a yacht charter on the French Riviera?', answer: 'Absolutely — the French Riviera is one of the few places where world-class golf and world-class yachting coexist within minutes of each other. Courses near the major yachting ports of Antibes, Cannes, and Saint-Tropez are all accessible for a half-day excursion from the boat.' }
];

// FAQ data (French)
const faqDataFR = [
    { question: 'Peut-on jouer au golf toute l\'année sur la Côte d\'Azur ?', answer: 'Oui. Le climat méditerranéen permet de jouer 12 mois sur 12. Les meilleures périodes sont le printemps (mars–mai) et l\'automne (septembre–novembre) avec des températures agréables et des parcours en excellent état.' },
    { question: 'Comment trouver des partenaires de golf sur la Côte d\'Azur ?', answer: 'La plateforme frenchriviera.golf permet aux golfeurs de créer un profil avec leur handicap, leur club habituel et leurs disponibilités, puis de trouver des partenaires pour des parties sur la Riviera. Le service est gratuit.' },
    { question: 'Quel est le meilleur golf de la Côte d\'Azur ?', answer: 'Terre Blanche est le parcours le mieux noté et le plus primé de la région, régulièrement classé parmi les meilleurs golfs d\'Europe. Pour un parcours historique avec vue exceptionnelle, le Monte-Carlo Golf Club est unique.' },
    { question: 'Combien coûte un green fee sur la Côte d\'Azur ?', answer: 'Les green fees varient de 35 € (Saint-Donat, 9 trous) à plus de 200 € (Terre Blanche en haute saison). La moyenne pour un 18 trous de qualité se situe entre 70 € et 120 €.' },
    { question: 'Faut-il un certificat de handicap pour jouer ?', answer: 'Certains parcours exigent un certificat de capacité ou une carte FFG. Le Royal Mougins et Cannes-Mougins appliquent des limites de handicap (28 pour les messieurs, 32 pour les dames). La plupart des autres parcours sont accessibles sans restriction.' },
    { question: 'Peut-on jouer au golf depuis un yacht sur la Côte d\'Azur ?', answer: 'Oui. Plusieurs marinas (Antibes, Cannes, Monaco, Saint-Tropez) sont à moins de 30 minutes des meilleurs parcours. Des services de conciergerie yacht proposent des transferts et réservations de tee-time.' },
    { question: 'Quel itinéraire golf recommandez-vous pour une semaine sur la Côte d\'Azur ?', answer: 'Un itinéraire classique d\'une semaine : Jour 1 — Royal Mougins. Jour 2 — Terre Blanche. Jour 3 — repos. Jour 4 — Monte-Carlo Golf Club. Jour 5 — Grande Bastide. Jour 6 — Taulane. Jour 7 — Old Course Mandelieu.' },
    { question: 'Existe-t-il un club de golf exclusif sur la Côte d\'Azur ?', answer: 'Le Cercle Riviera est une société de golf privée basée sur la Côte d\'Azur qui organise des événements exclusifs et des compétitions entre membres. Plus d\'informations sur frenchriviera.golf.' }
];

// Hreflang configuration
const hreflangConfig = {
    en: '/guides/best-golf-courses-french-riviera-2026',
    fr: '/guides/meilleurs-golfs-cote-azur-2026',
    'x-default': '/guides/best-golf-courses-french-riviera-2026'
};

// GET /guides/best-golf-courses-french-riviera-2026 (English)
router.get('/best-golf-courses-french-riviera-2026', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Best Golf Courses on the French Riviera 2026",
            "description": "Ranked guide to the top 10 golf courses on the Côte d'Azur, France",
            "numberOfItems": top10CoursesEN.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": top10CoursesEN.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressRegion": course.region, "addressCountry": "FR" },
                    "priceRange": course.greenFee,
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": course.rating, "bestRating": "5" }
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqDataEN.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best Golf Courses on the French Riviera — 2026 Guide",
            "description": "Ranked guide to 20+ golf courses on the Côte d'Azur. Green fees, comparisons, reviews, and free player matching.",
            "image": `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL, "logo": { "@type": "ImageObject", "url": `${APP_URL}/images/logo.png` } },
            "datePublished": "2026-02-25",
            "dateModified": "2026-02-25",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${APP_URL}/guides/best-golf-courses-french-riviera-2026` }
        };

        const breadcrumbs = [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": APP_URL },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": `${APP_URL}/guides` },
            { "@type": "ListItem", "position": 3, "name": "Best Golf Courses French Riviera 2026" }
        ];

        res.render('guides/best-golf-courses', {
            title: 'Best Golf Courses on the French Riviera — 2026 Guide',
            metaDescription: 'Ranked guide to 20+ golf courses on the Côte d\'Azur. Green fees, course comparisons, reviews, and free player matching. Updated February 2026.',
            canonicalPath: '/guides/best-golf-courses-french-riviera-2026',
            ogImage: `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            ogType: 'article',
            keywords: 'best golf courses french riviera, golf cote d azur, golf monaco, golf cannes, golf nice, terre blanche, royal mougins, monte carlo golf, french riviera golf guide 2026',
            breadcrumbs,
            schema: [itemListSchema, faqSchema, articleSchema],
            top10Courses: top10CoursesEN,
            faqData: faqDataEN,
            courseLinks,
            hreflang: hreflangConfig,
            currentLang: 'en',
            alternateLang: { code: 'fr', url: '/guides/meilleurs-golfs-cote-azur-2026', label: 'Français' }
        });

    } catch (err) {
        console.error('Guide page error:', err);
        req.session.error = 'Error loading guide';
        res.redirect('/');
    }
});

// GET /guides/meilleurs-golfs-cote-azur-2026 (French)
router.get('/meilleurs-golfs-cote-azur-2026', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Les Meilleurs Golfs de la Côte d'Azur 2026",
            "description": "Classement des 10 meilleurs parcours de golf sur la Côte d'Azur, France",
            "numberOfItems": top10CoursesFR.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": top10CoursesFR.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressRegion": course.region, "addressCountry": "FR" },
                    "priceRange": course.greenFee,
                    "aggregateRating": { "@type": "AggregateRating", "ratingValue": course.rating, "bestRating": "5" }
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqDataFR.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Les Meilleurs Golfs de la Côte d'Azur — Guide 2026",
            "description": "Classement des 20+ parcours de golf sur la Côte d'Azur. Green fees, comparatifs, avis et mise en relation gratuite entre golfeurs.",
            "image": `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL, "logo": { "@type": "ImageObject", "url": `${APP_URL}/images/logo.png` } },
            "datePublished": "2026-02-25",
            "dateModified": "2026-02-25",
            "inLanguage": "fr",
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${APP_URL}/guides/meilleurs-golfs-cote-azur-2026` }
        };

        const breadcrumbs = [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": APP_URL },
            { "@type": "ListItem", "position": 2, "name": "Guides", "item": `${APP_URL}/guides` },
            { "@type": "ListItem", "position": 3, "name": "Meilleurs Golfs Côte d'Azur 2026" }
        ];

        res.render('guides/meilleurs-golfs', {
            title: 'Les Meilleurs Golfs de la Côte d\'Azur — Guide 2026',
            metaDescription: 'Classement des 20+ parcours de golf sur la Côte d\'Azur. Green fees, comparatifs, avis et mise en relation gratuite entre golfeurs. Mis à jour février 2026.',
            canonicalPath: '/guides/meilleurs-golfs-cote-azur-2026',
            ogImage: `${APP_URL}/images/og-best-golf-courses-2026.jpg`,
            ogType: 'article',
            keywords: 'meilleurs golfs cote azur, golf côte d azur, golf monaco, golf cannes, golf nice, terre blanche, royal mougins, monte carlo golf, guide golf 2026',
            htmlLang: 'fr',
            breadcrumbs,
            schema: [itemListSchema, faqSchema, articleSchema],
            top10Courses: top10CoursesFR,
            faqData: faqDataFR,
            courseLinks,
            hreflang: hreflangConfig,
            currentLang: 'fr',
            alternateLang: { code: 'en', url: '/guides/best-golf-courses-french-riviera-2026', label: 'English' }
        });

    } catch (err) {
        console.error('Guide page error:', err);
        req.session.error = 'Erreur lors du chargement du guide';
        res.redirect('/');
    }
});

// Guides index
router.get('/', (req, res) => {
    res.redirect('/guides/best-golf-courses-french-riviera-2026');
});

module.exports = router;
