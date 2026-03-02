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

// ============================================
// GOLF NEAR NICE AIRPORT GUIDE
// ============================================

const airportCoursesEN = [
    { position: 1, name: 'Golf de Biot', slug: 'golf-club-biot', city: 'Biot', distance: '15 min', holes: 18, par: 70, greenFee: '€45-75', description: 'The closest 18-hole course to Nice airport. Charming layout at the foot of the historic village of Biot, famous for its glassblowing.' },
    { position: 2, name: 'Nice Golf Country Club', slug: 'nice-golf-country-club', city: 'Nice', distance: '12 min', holes: 9, par: 32, greenFee: '€25-40', description: 'Compact 9-hole course just 10 minutes from the terminal. Perfect for a quick round before your flight.' },
    { position: 3, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-Grasse', distance: '25 min', holes: 18, par: 72, greenFee: '€55-95', description: 'Best value championship course near the airport. Excellent conditioning year-round.' },
    { position: 4, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', distance: '30 min', holes: 18, par: 72, greenFee: '€55-130', description: 'Beautiful estate course with château clubhouse. Worth the extra 10 minutes from the airport.' },
    { position: 5, name: 'Golf Country Club Cannes-Mougins', slug: 'cannes-mougins-golf-country-club', city: 'Mougins', distance: '35 min', holes: 18, par: 72, greenFee: '€80-150', description: 'Historic European Tour venue. Premium experience within easy reach of the airport.' }
];

const airportCoursesFR = [
    { position: 1, name: 'Golf de Biot', slug: 'golf-club-biot', city: 'Biot', distance: '15 min', holes: 18, par: 70, greenFee: '45-75 €', description: 'Le 18 trous le plus proche de l\'aéroport de Nice. Parcours charmant au pied du village historique de Biot.' },
    { position: 2, name: 'Nice Golf Country Club', slug: 'nice-golf-country-club', city: 'Nice', distance: '12 min', holes: 9, par: 32, greenFee: '25-40 €', description: 'Compact 9 trous à 10 minutes du terminal. Parfait pour une partie rapide avant votre vol.' },
    { position: 3, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-Grasse', distance: '25 min', holes: 18, par: 72, greenFee: '55-95 €', description: 'Meilleur rapport qualité-prix près de l\'aéroport. Excellent entretien toute l\'année.' },
    { position: 4, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', distance: '30 min', holes: 18, par: 72, greenFee: '55-130 €', description: 'Magnifique domaine avec château en guise de clubhouse. Vaut les 10 minutes supplémentaires.' },
    { position: 5, name: 'Cannes-Mougins Country Club', slug: 'cannes-mougins-golf-country-club', city: 'Mougins', distance: '35 min', holes: 18, par: 72, greenFee: '80-150 €', description: 'Ancien parcours de l\'European Tour. Expérience premium accessible depuis l\'aéroport.' }
];

const airportFaqEN = [
    { question: 'How far is Nice airport from the nearest golf course?', answer: 'Nice Golf Country Club is just 12 minutes from Nice Côte d\'Azur Airport (NCE). Golf de Biot, the nearest 18-hole course, is 15 minutes away.' },
    { question: 'Can I play golf on arrival day at Nice airport?', answer: 'Yes, if you land before noon. Most courses accept tee times until 2-3 hours before sunset. Golf de Biot and Nice Golf Country Club are close enough for an afternoon round after a morning arrival.' },
    { question: 'Is there golf club storage at Nice airport?', answer: 'There are luggage storage services at Nice airport Terminal 1 and 2. You can store your regular luggage while playing golf, or vice versa.' },
    { question: 'Which airport golf courses offer club rental?', answer: 'All five courses near Nice airport offer club rental. Expect to pay €30-50 for a full set.' }
];

const airportFaqFR = [
    { question: 'À quelle distance de l\'aéroport de Nice se trouve le golf le plus proche ?', answer: 'Le Nice Golf Country Club est à seulement 12 minutes de l\'aéroport Nice Côte d\'Azur (NCE). Le Golf de Biot, le 18 trous le plus proche, est à 15 minutes.' },
    { question: 'Peut-on jouer au golf le jour de son arrivée à Nice ?', answer: 'Oui, si vous atterrissez avant midi. La plupart des parcours acceptent les départs jusqu\'à 2-3 heures avant le coucher du soleil.' },
    { question: 'Y a-t-il une consigne à bagages à l\'aéroport de Nice ?', answer: 'Des services de consigne sont disponibles aux Terminaux 1 et 2. Vous pouvez y laisser vos bagages pendant votre partie de golf.' },
    { question: 'Quels golfs près de l\'aéroport proposent la location de clubs ?', answer: 'Les cinq parcours près de l\'aéroport proposent la location de clubs. Comptez 30-50 € pour un set complet.' }
];

const airportHreflang = {
    en: '/guides/golf-near-nice-airport',
    fr: '/guides/golf-pres-aeroport-nice',
    'x-default': '/guides/golf-near-nice-airport'
};

// GET /guides/golf-near-nice-airport (English)
router.get('/golf-near-nice-airport', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Golf Courses Near Nice Airport",
            "description": "Golf courses within 35 minutes of Nice Côte d'Azur Airport",
            "numberOfItems": airportCoursesEN.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": airportCoursesEN.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": airportFaqEN.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Golf Courses Near Nice Airport — 2026 Guide",
            "description": "5 golf courses within 35 minutes of Nice Côte d'Azur Airport. Play before or after your flight.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02"
        };

        res.render('guides/golf-near-airport', {
            title: 'Golf Courses Near Nice Airport — 2026 Guide',
            metaDescription: '5 golf courses within 35 minutes of Nice Côte d\'Azur Airport (NCE). Play golf before or after your flight on the French Riviera.',
            canonicalPath: '/guides/golf-near-nice-airport',
            ogType: 'article',
            keywords: 'golf near nice airport, golf NCE airport, golf cote azur airport, play golf nice, french riviera golf airport',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: airportCoursesEN,
            faqData: airportFaqEN,
            courseLinks,
            hreflang: airportHreflang,
            currentLang: 'en',
            alternateLang: { code: 'fr', url: '/guides/golf-pres-aeroport-nice', label: 'Français' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

// GET /guides/golf-pres-aeroport-nice (French)
router.get('/golf-pres-aeroport-nice', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Golfs près de l'aéroport de Nice",
            "description": "Parcours de golf à moins de 35 minutes de l'aéroport Nice Côte d'Azur",
            "numberOfItems": airportCoursesFR.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": airportCoursesFR.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": airportFaqFR.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Golfs près de l'Aéroport de Nice — Guide 2026",
            "description": "5 parcours de golf à moins de 35 minutes de l'aéroport Nice Côte d'Azur.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02",
            "inLanguage": "fr"
        };

        res.render('guides/golf-pres-aeroport', {
            title: 'Golfs près de l\'Aéroport de Nice — Guide 2026',
            metaDescription: '5 parcours de golf à moins de 35 minutes de l\'aéroport Nice Côte d\'Azur (NCE). Jouez avant ou après votre vol.',
            canonicalPath: '/guides/golf-pres-aeroport-nice',
            htmlLang: 'fr',
            ogType: 'article',
            keywords: 'golf aeroport nice, golf NCE, golf cote azur aeroport, jouer golf nice, french riviera golf',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: airportCoursesFR,
            faqData: airportFaqFR,
            courseLinks,
            hreflang: airportHreflang,
            currentLang: 'fr',
            alternateLang: { code: 'en', url: '/guides/golf-near-nice-airport', label: 'English' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

// ============================================
// BUDGET GOLF GUIDE
// ============================================

const budgetCoursesEN = [
    { position: 1, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-Grasse', holes: 18, par: 72, greenFee: '€55-95', lowSeason: '€55', description: 'Best value championship course on the Riviera. Cabell Robinson design with excellent conditioning.' },
    { position: 2, name: 'Golf de Saint-Donat', slug: 'golf-saint-donat', city: 'Grasse', holes: 18, par: 71, greenFee: '€55-85', lowSeason: '€55', description: 'Robert Trent Jones Jr. design above the perfume capital. Mountain views and challenging layout.' },
    { position: 3, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', holes: 18, par: 72, greenFee: '€55-130', lowSeason: '€55', description: 'Estate course with château clubhouse. Twilight rates available from €45.' },
    { position: 4, name: 'Golf de Roquebrune', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', holes: 18, par: 72, greenFee: '€50-90', lowSeason: '€50', description: 'Wooded course between Cannes and Saint-Tropez. Resort facilities available.' },
    { position: 5, name: 'Golf de Biot', slug: 'golf-club-biot', city: 'Biot', holes: 18, par: 70, greenFee: '€45-75', lowSeason: '€45', description: 'Charming course near the coast. One of the most affordable 18-hole options.' },
    { position: 6, name: 'Nice Golf Country Club', slug: 'nice-golf-country-club', city: 'Nice', holes: 9, par: 32, greenFee: '€25-40', lowSeason: '€25', description: 'Most affordable option for a quick round. 9 holes close to Nice center.' }
];

const budgetCoursesFR = [
    { position: 1, name: 'Golf de la Grande Bastide', slug: 'grande-bastide', city: 'Châteauneuf-Grasse', holes: 18, par: 72, greenFee: '55-95 €', lowSeason: '55 €', description: 'Meilleur rapport qualité-prix de la Riviera. Design de Cabell Robinson, excellent entretien.' },
    { position: 2, name: 'Golf de Saint-Donat', slug: 'golf-saint-donat', city: 'Grasse', holes: 18, par: 71, greenFee: '55-85 €', lowSeason: '55 €', description: 'Parcours Robert Trent Jones Jr. au-dessus de la capitale du parfum. Vues montagneuses.' },
    { position: 3, name: 'Golf d\'Opio-Valbonne', slug: 'golf-opio-valbonne', city: 'Opio', holes: 18, par: 72, greenFee: '55-130 €', lowSeason: '55 €', description: 'Domaine avec château en clubhouse. Tarifs twilight disponibles à partir de 45 €.' },
    { position: 4, name: 'Golf de Roquebrune', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', holes: 18, par: 72, greenFee: '50-90 €', lowSeason: '50 €', description: 'Parcours boisé entre Cannes et Saint-Tropez. Équipements de resort disponibles.' },
    { position: 5, name: 'Golf de Biot', slug: 'golf-club-biot', city: 'Biot', holes: 18, par: 70, greenFee: '45-75 €', lowSeason: '45 €', description: 'Parcours charmant près de la côte. L\'un des 18 trous les plus abordables.' },
    { position: 6, name: 'Nice Golf Country Club', slug: 'nice-golf-country-club', city: 'Nice', holes: 9, par: 32, greenFee: '25-40 €', lowSeason: '25 €', description: 'Option la plus économique. 9 trous près du centre de Nice.' }
];

const budgetFaqEN = [
    { question: 'What is the cheapest golf course on the French Riviera?', answer: 'Nice Golf Country Club offers 9 holes from €25. For 18 holes, Golf de Biot starts at €45 and Grande Bastide at €55 in low season.' },
    { question: 'When is low season for golf on the French Riviera?', answer: 'Low season is typically November to February. Green fees can be 30-50% lower than peak summer rates. The weather is still pleasant for golf.' },
    { question: 'Are there twilight rates at French Riviera golf courses?', answer: 'Yes, most courses offer twilight rates starting 2-3 hours before sunset. Expect 30-40% off the standard green fee. Opio-Valbonne offers twilight from €45.' },
    { question: 'Can I get golf discounts with a French golf federation card?', answer: 'Some courses offer discounts to FFG (French Golf Federation) cardholders. Grande Bastide and Saint-Donat typically honor FFG rates.' }
];

const budgetFaqFR = [
    { question: 'Quel est le golf le moins cher de la Côte d\'Azur ?', answer: 'Le Nice Golf Country Club propose 9 trous à partir de 25 €. Pour 18 trous, le Golf de Biot démarre à 45 € et la Grande Bastide à 55 € en basse saison.' },
    { question: 'Quand est la basse saison pour le golf sur la Côte d\'Azur ?', answer: 'La basse saison s\'étend généralement de novembre à février. Les green fees peuvent être 30-50% moins chers qu\'en été. Le temps reste agréable pour jouer.' },
    { question: 'Y a-t-il des tarifs twilight sur les golfs de la Côte d\'Azur ?', answer: 'Oui, la plupart des parcours proposent des tarifs twilight 2-3 heures avant le coucher du soleil. Comptez 30-40% de réduction. Opio-Valbonne propose le twilight à partir de 45 €.' },
    { question: 'Peut-on avoir des réductions avec une carte FFG ?', answer: 'Certains parcours accordent des réductions aux détenteurs de la carte FFG. La Grande Bastide et Saint-Donat honorent généralement les tarifs FFG.' }
];

const budgetHreflang = {
    en: '/guides/budget-golf-french-riviera',
    fr: '/guides/golf-pas-cher-cote-azur',
    'x-default': '/guides/budget-golf-french-riviera'
};

// GET /guides/budget-golf-french-riviera (English)
router.get('/budget-golf-french-riviera', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Budget Golf Courses on the French Riviera",
            "description": "Affordable golf courses under €80 on the Côte d'Azur",
            "numberOfItems": budgetCoursesEN.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": budgetCoursesEN.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": budgetFaqEN.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Budget Golf on the French Riviera — 2026 Guide",
            "description": "Affordable golf courses under €80 on the Côte d'Azur. Low season rates, twilight deals, and best value options.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02"
        };

        res.render('guides/budget-golf', {
            title: 'Budget Golf on the French Riviera — 2026 Guide',
            metaDescription: 'Affordable golf courses under €80 on the Côte d\'Azur. Find the best value courses, low season rates, and twilight deals.',
            canonicalPath: '/guides/budget-golf-french-riviera',
            ogType: 'article',
            keywords: 'cheap golf french riviera, budget golf cote azur, affordable golf nice, golf deals france, low cost golf cannes',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: budgetCoursesEN,
            faqData: budgetFaqEN,
            courseLinks,
            hreflang: budgetHreflang,
            currentLang: 'en',
            alternateLang: { code: 'fr', url: '/guides/golf-pas-cher-cote-azur', label: 'Français' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

// GET /guides/golf-pas-cher-cote-azur (French)
router.get('/golf-pas-cher-cote-azur', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Golfs Pas Chers sur la Côte d'Azur",
            "description": "Parcours de golf abordables à moins de 80 € sur la Côte d'Azur",
            "numberOfItems": budgetCoursesFR.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": budgetCoursesFR.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": budgetFaqFR.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Golf Pas Cher sur la Côte d'Azur — Guide 2026",
            "description": "Parcours de golf abordables à moins de 80 € sur la Côte d'Azur. Tarifs basse saison et offres twilight.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02",
            "inLanguage": "fr"
        };

        res.render('guides/golf-pas-cher', {
            title: 'Golf Pas Cher sur la Côte d\'Azur — Guide 2026',
            metaDescription: 'Parcours de golf abordables à moins de 80 € sur la Côte d\'Azur. Meilleurs tarifs, basse saison et offres twilight.',
            canonicalPath: '/guides/golf-pas-cher-cote-azur',
            htmlLang: 'fr',
            ogType: 'article',
            keywords: 'golf pas cher cote azur, golf economique nice, golf petit budget france, tarifs golf cannes, golf abordable riviera',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: budgetCoursesFR,
            faqData: budgetFaqFR,
            courseLinks,
            hreflang: budgetHreflang,
            currentLang: 'fr',
            alternateLang: { code: 'en', url: '/guides/budget-golf-french-riviera', label: 'English' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

// ============================================
// GOLF RESORTS GUIDE
// ============================================

const resortCoursesEN = [
    { position: 1, name: 'Terre Blanche Hotel Spa Golf Resort', slug: 'terre-blanche-chateau', city: 'Tourrettes', holes: 36, greenFee: '€96-200+', hotel: '5-star, 115 suites', spa: 'Yes - 3,200m²', description: 'The ultimate French Riviera golf resort. Two championship courses, luxury spa, and Michelin-star dining.' },
    { position: 2, name: 'Royal Mougins Golf Resort', slug: 'royal-mougins-golf-club', city: 'Mougins', holes: 18, greenFee: '€95-165', hotel: '4-star, 29 suites', spa: 'Yes', description: 'Boutique golf resort with Robert von Hagge course. Intimate setting near Cannes.' },
    { position: 3, name: 'Golf de Roquebrune Resort', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', holes: 18, greenFee: '€50-90', hotel: '5-star, 100 rooms', spa: 'Yes', description: 'Full resort between Cannes and Saint-Tropez. Golf, spa, pools, and gourmet restaurant.' },
    { position: 4, name: 'Château de Taulane', slug: 'chateau-de-taulane', city: 'La Martre', holes: 18, greenFee: '€60-100', hotel: '4-star château', spa: 'Yes', description: 'Gary Player course at 1,000m altitude. Historic château accommodation in the Verdon countryside.' },
    { position: 5, name: 'Golf de Saint-Endréol', slug: 'golf-saint-endreol', city: 'La Motte', holes: 18, greenFee: '€50-85', hotel: '4-star, 80 rooms', spa: 'Yes', description: 'Resort in the Var countryside. Golf, tennis, spa, and family-friendly facilities.' }
];

const resortCoursesFR = [
    { position: 1, name: 'Terre Blanche Hotel Spa Golf Resort', slug: 'terre-blanche-chateau', city: 'Tourrettes', holes: 36, greenFee: '96-200+ €', hotel: '5 étoiles, 115 suites', spa: 'Oui - 3 200 m²', description: 'Le resort golf ultime de la Côte d\'Azur. Deux parcours championship, spa de luxe et restaurant étoilé.' },
    { position: 2, name: 'Royal Mougins Golf Resort', slug: 'royal-mougins-golf-club', city: 'Mougins', holes: 18, greenFee: '95-165 €', hotel: '4 étoiles, 29 suites', spa: 'Oui', description: 'Resort golf boutique avec parcours Robert von Hagge. Cadre intimiste près de Cannes.' },
    { position: 3, name: 'Golf de Roquebrune Resort', slug: 'golf-roquebrune', city: 'Roquebrune-sur-Argens', holes: 18, greenFee: '50-90 €', hotel: '5 étoiles, 100 chambres', spa: 'Oui', description: 'Resort complet entre Cannes et Saint-Tropez. Golf, spa, piscines et restaurant gastronomique.' },
    { position: 4, name: 'Château de Taulane', slug: 'chateau-de-taulane', city: 'La Martre', holes: 18, greenFee: '60-100 €', hotel: 'Château 4 étoiles', spa: 'Oui', description: 'Parcours Gary Player à 1 000 m d\'altitude. Hébergement en château historique dans le Verdon.' },
    { position: 5, name: 'Golf de Saint-Endréol', slug: 'golf-saint-endreol', city: 'La Motte', holes: 18, greenFee: '50-85 €', hotel: '4 étoiles, 80 chambres', spa: 'Oui', description: 'Resort dans la campagne varoise. Golf, tennis, spa et équipements familiaux.' }
];

const resortFaqEN = [
    { question: 'What is the best golf resort on the French Riviera?', answer: 'Terre Blanche is consistently rated the best golf resort on the French Riviera and in France. It offers 36 holes, a 5-star hotel, a 3,200m² spa, and multiple restaurants including Michelin-starred dining.' },
    { question: 'Are there golf resorts near Saint-Tropez?', answer: 'Yes. Golf de Roquebrune Resort is 30 minutes from Saint-Tropez and offers 5-star accommodation. Golf de Saint-Endréol is 40 minutes away with 4-star facilities.' },
    { question: 'Can I book stay-and-play packages on the French Riviera?', answer: 'Yes, all five golf resorts offer stay-and-play packages combining accommodation, golf, and often spa access. Terre Blanche and Royal Mougins have the most comprehensive packages.' },
    { question: 'Which French Riviera golf resort has the best spa?', answer: 'Terre Blanche has the largest and most luxurious spa (3,200m²) featuring 14 treatment rooms, pools, and a fitness center. Royal Mougins and Roquebrune also have excellent spa facilities.' }
];

const resortFaqFR = [
    { question: 'Quel est le meilleur resort golf de la Côte d\'Azur ?', answer: 'Terre Blanche est régulièrement classé meilleur resort golf de la Côte d\'Azur et de France. Il propose 36 trous, un hôtel 5 étoiles, un spa de 3 200 m² et plusieurs restaurants dont un étoilé Michelin.' },
    { question: 'Y a-t-il des resorts golf près de Saint-Tropez ?', answer: 'Oui. Le Golf de Roquebrune Resort est à 30 minutes de Saint-Tropez avec hébergement 5 étoiles. Le Golf de Saint-Endréol est à 40 minutes avec des équipements 4 étoiles.' },
    { question: 'Peut-on réserver des forfaits séjour golf sur la Côte d\'Azur ?', answer: 'Oui, les cinq resorts proposent des forfaits combinant hébergement, golf et souvent accès spa. Terre Blanche et Royal Mougins offrent les forfaits les plus complets.' },
    { question: 'Quel resort golf de la Côte d\'Azur a le meilleur spa ?', answer: 'Terre Blanche possède le spa le plus grand et luxueux (3 200 m²) avec 14 salles de soins, piscines et centre de fitness. Royal Mougins et Roquebrune ont également d\'excellents spas.' }
];

const resortHreflang = {
    en: '/guides/best-golf-resorts-french-riviera',
    fr: '/guides/meilleurs-resorts-golf-cote-azur',
    'x-default': '/guides/best-golf-resorts-french-riviera'
};

// GET /guides/best-golf-resorts-french-riviera (English)
router.get('/best-golf-resorts-french-riviera', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Best Golf Resorts on the French Riviera",
            "description": "Golf resorts with hotels and spas on the Côte d'Azur",
            "numberOfItems": resortCoursesEN.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": resortCoursesEN.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": resortFaqEN.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best Golf Resorts on the French Riviera — 2026 Guide",
            "description": "5 golf resorts with hotels and spas on the Côte d'Azur. Stay-and-play packages, luxury amenities, and championship courses.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02"
        };

        res.render('guides/golf-resorts', {
            title: 'Best Golf Resorts on the French Riviera — 2026 Guide',
            metaDescription: '5 golf resorts with hotels and spas on the Côte d\'Azur. Stay-and-play packages at Terre Blanche, Royal Mougins, and more.',
            canonicalPath: '/guides/best-golf-resorts-french-riviera',
            ogType: 'article',
            keywords: 'golf resorts french riviera, golf hotel cote azur, terre blanche resort, golf spa france, stay and play golf nice',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: resortCoursesEN,
            faqData: resortFaqEN,
            courseLinks,
            hreflang: resortHreflang,
            currentLang: 'en',
            alternateLang: { code: 'fr', url: '/guides/meilleurs-resorts-golf-cote-azur', label: 'Français' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

// GET /guides/meilleurs-resorts-golf-cote-azur (French)
router.get('/meilleurs-resorts-golf-cote-azur', async (req, res) => {
    try {
        const APP_URL = process.env.APP_URL || 'https://frenchriviera.golf';

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Meilleurs Resorts Golf de la Côte d'Azur",
            "description": "Resorts golf avec hôtels et spas sur la Côte d'Azur",
            "numberOfItems": resortCoursesFR.length,
            "itemListOrder": "https://schema.org/ItemListOrderDescending",
            "itemListElement": resortCoursesFR.map(course => ({
                "@type": "ListItem",
                "position": course.position,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": `${APP_URL}/courses/${course.slug}`,
                    "description": course.description,
                    "address": { "@type": "PostalAddress", "addressLocality": course.city, "addressCountry": "FR" },
                    "priceRange": course.greenFee
                }
            }))
        };

        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": resortFaqFR.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Meilleurs Resorts Golf de la Côte d'Azur — Guide 2026",
            "description": "5 resorts golf avec hôtels et spas sur la Côte d'Azur. Forfaits séjour golf à Terre Blanche, Royal Mougins et plus.",
            "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "publisher": { "@type": "Organization", "name": "frenchriviera.golf", "url": APP_URL },
            "datePublished": "2026-03-02",
            "dateModified": "2026-03-02",
            "inLanguage": "fr"
        };

        res.render('guides/resorts-golf', {
            title: 'Meilleurs Resorts Golf de la Côte d\'Azur — Guide 2026',
            metaDescription: '5 resorts golf avec hôtels et spas sur la Côte d\'Azur. Forfaits séjour golf à Terre Blanche, Royal Mougins et plus.',
            canonicalPath: '/guides/meilleurs-resorts-golf-cote-azur',
            htmlLang: 'fr',
            ogType: 'article',
            keywords: 'resort golf cote azur, hotel golf france, terre blanche resort, golf spa cote azur, sejour golf nice',
            schema: [itemListSchema, faqSchema, articleSchema],
            courses: resortCoursesFR,
            faqData: resortFaqFR,
            courseLinks,
            hreflang: resortHreflang,
            currentLang: 'fr',
            alternateLang: { code: 'en', url: '/guides/best-golf-resorts-french-riviera', label: 'English' }
        });
    } catch (err) {
        console.error('Guide page error:', err);
        res.redirect('/');
    }
});

module.exports = router;
