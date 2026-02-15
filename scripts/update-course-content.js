require('dotenv').config();
const db = require('../config/database');

// Rich SEO content for each course
const courseContent = [
    {
        slug: "monte-carlo-golf-club",
        insider_tips: "Book at least 2 weeks in advance during high season. The front 9 is more forgiving than the challenging back 9. Bring an extra layer - it can be 5°C cooler at 900m altitude.",
        green_fee_info: "Green fees range from €130-180 depending on season. Twilight rates available after 3pm. Club members get preferential rates.",
        dress_code: "Smart casual required. Collared shirts mandatory, no jeans or trainers. Soft spikes only."
    },
    {
        slug: "royal-mougins-golf-club",
        insider_tips: "This is a private club - access for hotel guests and members only. The 18th hole with its island green is signature. Best played in spring when the mimosas bloom.",
        green_fee_info: "Reserved for members and hotel guests. Contact the club for current rates and availability.",
        dress_code: "Strict dress code enforced. Collared shirts, tailored shorts or trousers. No denim."
    },
    {
        slug: "cannes-mougins-golf-country-club",
        insider_tips: "Walk the course if you can - the Valmasque Forest setting is stunning. The par-3 5th hole is a gem. Restaurant has excellent lunch options.",
        green_fee_info: "Green fees €80-150 depending on season. Packages available with nearby hotels. Junior rates available.",
        dress_code: "Traditional golf attire. Collared shirts required. Golf shoes mandatory."
    },
    {
        slug: "terre-blanche-chateau",
        insider_tips: "The Albatros Golf Performance Centre is world-class for lessons. Play early morning for best conditions. The views of Provence are spectacular.",
        green_fee_info: "Premium pricing €180-300. Resort guests get priority booking. Green fee includes range balls.",
        dress_code: "Elegant golf attire required. No cargo shorts. Soft spikes only."
    },
    {
        slug: "terre-blanche-le-riou",
        insider_tips: "Less crowded than the Château course but equally challenging. The steep fairways require good course management. Book through the resort.",
        green_fee_info: "Similar pricing to Château course. Multi-round packages offer better value.",
        dress_code: "Same standards as Château course. Elegant golf attire required."
    },
    {
        slug: "old-course-mandelieu",
        insider_tips: "One of France's oldest courses - respect the history! The flat terrain makes it walkable. Beware of the Siagne river on several holes.",
        green_fee_info: "Green fees €70-120. Excellent value for a historic course. Twilight and winter rates available.",
        dress_code: "Classic golf attire. Collared shirts required. Respectful dress expected."
    },
    {
        slug: "riviera-golf-barbossi",
        insider_tips: "Don't miss the contemporary sculptures dotted around the course. The vineyard views are exceptional. Try the local wine at the clubhouse.",
        green_fee_info: "Green fees €60-100. Good value for RTJ Sr design. Wine tasting packages available.",
        dress_code: "Smart golf attire. Collared shirts expected."
    },
    {
        slug: "golf-opio-valbonne",
        insider_tips: "The 220-hectare estate offers incredible variety. Some blind shots - use the course guide. The practice facilities are extensive.",
        green_fee_info: "Green fees €70-130. Resort packages with accommodation available. Good twilight rates.",
        dress_code: "Standard golf attire. Collared shirts and appropriate footwear required."
    },
    {
        slug: "grande-bastide",
        insider_tips: "Seven water features come into play - bring extra balls! Very popular so book ahead. The rolling terrain provides good variety.",
        green_fee_info: "Green fees €50-90. Excellent value. Frequent promotions available online.",
        dress_code: "Casual golf attire accepted. Collared shirts preferred."
    },
    {
        slug: "golf-club-biot",
        insider_tips: "Visit the famous Biot glassworks village nearby. The atypical layout rewards creativity. One of the region's hidden gems.",
        green_fee_info: "Green fees €50-80. Very reasonable for the area. Members' guest rates available.",
        dress_code: "Relaxed dress code. Neat golf attire expected."
    },
    {
        slug: "golf-saint-donat",
        insider_tips: "RTJ Jr design with strategic water hazards. The ancient Roman road adds character. Gary Player inaugurated this course - play like a champion!",
        green_fee_info: "Green fees €60-100. Good mid-range option. Corporate packages available.",
        dress_code: "Smart casual golf attire. Collared shirts required."
    },
    {
        slug: "golf-roquebrune",
        insider_tips: "The Maures massif backdrop is stunning for photos. Combine with a stay at the 5-star hotel. Technical course rewards accurate iron play.",
        green_fee_info: "Green fees €80-140. Stay-and-play packages offer good value. Spa access can be included.",
        dress_code: "Elegant golf attire. Standards match the 5-star resort."
    },
    {
        slug: "golf-saint-endreol",
        insider_tips: "Ranked in France's Top 50 - don't miss it! The River Endre and Rocher de Roquebrune create dramatic scenery. Best at sunset.",
        green_fee_info: "Green fees €70-120. Resort packages available. Good value for a top-rated course.",
        dress_code: "Smart golf attire required. Collared shirts mandatory."
    },
    {
        slug: "golf-valescure",
        insider_tips: "Over 100 years old with tiny 'postage stamp' greens. Short but tricky - leave the driver in the bag on many holes. True links-style experience.",
        green_fee_info: "Green fees €50-80. Affordable for its quality and history. Combined tickets with Estérel available.",
        dress_code: "Traditional British golf attire. Smart casual expected."
    },
    {
        slug: "chateau-de-taulane",
        insider_tips: "At 1000m altitude in the Gorges du Verdon - a unique experience. Absolute tranquility. Combine with hiking in the gorges.",
        green_fee_info: "Green fees €80-130. Remote location but worth the drive. Hotel packages recommended.",
        dress_code: "Smart golf attire. Relaxed mountain atmosphere."
    },
    {
        slug: "golf-saint-tropez",
        insider_tips: "Gary Player design with Provençal charm. Celebrity spotting possible in high season. The 1600m² clubhouse is impressive.",
        green_fee_info: "Premium pricing €100-180 reflecting the St-Tropez location. Book well in advance in summer.",
        dress_code: "Chic golf attire befitting St-Tropez. Smart casual minimum."
    },
    {
        slug: "nice-golf-country-club",
        insider_tips: "Perfect for a quick round - just 10 mins from Nice seafront. Ideal for beginners or time-pressed golfers. Friendly local atmosphere.",
        green_fee_info: "Green fees €30-50. Most affordable option on the Riviera. 9-hole rates available.",
        dress_code: "Casual golf attire accepted. Family-friendly atmosphere."
    },
    {
        slug: "golf-claux-amic",
        insider_tips: "Great for a multi-course trip - 4 other courses within 15 minutes. Good practice facilities. Local favorite with welcoming atmosphere.",
        green_fee_info: "Green fees €45-75. Good value. Multi-course passes available for the Grasse area.",
        dress_code: "Standard golf attire. Neat casual accepted."
    },
    {
        slug: "golf-barbaroux",
        insider_tips: "Pete Dye design - expect challenging carries and strategic choices. The Provençal countryside is beautiful. Worth the drive from the coast.",
        green_fee_info: "Green fees €70-120. Championship course at reasonable rates. Good practice facilities included.",
        dress_code: "Smart golf attire required. Collared shirts expected."
    },
    {
        slug: "esterel-latitudes-golf",
        insider_tips: "RTJ Sr design complements nearby Valescure perfectly. Modern layout contrasts with its classic neighbor. Good 36-hole day option.",
        green_fee_info: "Green fees €50-90. Combined tickets with Valescure available. Good value.",
        dress_code: "Smart casual golf attire. Relaxed but respectful."
    }
];

async function updateCourseContent() {
    console.log('Updating golf course SEO content...\n');

    for (const course of courseContent) {
        try {
            const result = await db.query(
                `UPDATE courses
                 SET insider_tips = $1, green_fee_info = $2, dress_code = $3, updated_at = NOW()
                 WHERE slug = $4
                 RETURNING name`,
                [course.insider_tips, course.green_fee_info, course.dress_code, course.slug]
            );

            if (result.rows.length > 0) {
                console.log(`✓ Updated: ${result.rows[0].name}`);
            } else {
                console.log(`✗ Not found: ${course.slug}`);
            }
        } catch (err) {
            console.error(`Error updating ${course.slug}:`, err.message);
        }
    }

    console.log('\nDone! Course content updated.');
    process.exit(0);
}

updateCourseContent();
