require('dotenv').config();
const db = require('../config/database');

const blogPosts = [
    {
        slug: 'best-golf-courses-beginners-french-riviera',
        title: 'Best Golf Courses for Beginners on the French Riviera',
        excerpt: 'Discover the most welcoming golf courses for beginners on the Côte d\'Azur. From forgiving fairways to excellent practice facilities.',
        category: 'Guides',
        author: 'French Riviera Golf',
        meta_description: 'Find the best golf courses for beginners on the French Riviera. Welcoming clubs, forgiving layouts, and great practice facilities on the Côte d\'Azur.',
        content: `
<p>The French Riviera is home to some of the world's most prestigious golf courses, but don't let that intimidate you if you're just starting out. Many courses on the Côte d'Azur warmly welcome beginners and offer excellent facilities to help you improve your game.</p>

<h2>What Makes a Course Good for Beginners?</h2>

<p>When looking for a beginner-friendly course, consider these factors:</p>

<ul>
<li><strong>Wide fairways</strong> that forgive wayward shots</li>
<li><strong>Fewer hazards</strong> or strategically placed ones that don't punish beginners too harshly</li>
<li><strong>Good practice facilities</strong> including driving ranges and putting greens</li>
<li><strong>Available lessons</strong> from PGA professionals</li>
<li><strong>Welcoming atmosphere</strong> without pressure to play quickly</li>
</ul>

<h2>Top Beginner-Friendly Courses</h2>

<h3>1. Nice Golf Country Club</h3>
<p>This compact 9-hole course is perfect for beginners. Located just 10 minutes from Nice's seafront, it offers a manageable challenge without being overwhelming. The shorter format means you can complete a round in under 2 hours, ideal for those still building stamina and confidence.</p>

<h3>2. Golf de la Grande Bastide</h3>
<p>Set in a magnificent wooded environment in Châteauneuf-Grasse, this course is known for being accessible to both experienced players and beginners. The seven water features add beauty without being overly punishing, and the layout offers multiple tee positions to suit your skill level.</p>

<h3>3. Golf Opio Valbonne</h3>
<p>One of the jewels of the Riviera, Opio Valbonne welcomes players of all levels. The 220-hectare natural domain provides a stunning backdrop, while the course design offers enough challenge to help you improve without destroying your confidence.</p>

<h2>Tips for Beginners on the French Riviera</h2>

<h3>Book Lessons</h3>
<p>Most clubs offer lessons with PGA-qualified professionals. Even a single lesson can dramatically improve your game and help you avoid developing bad habits early on.</p>

<h3>Start with 9 Holes</h3>
<p>Don't feel pressured to play 18 holes. Many courses offer 9-hole rounds, perfect for building your game gradually.</p>

<h3>Visit During Off-Peak Times</h3>
<p>Weekday afternoons tend to be quieter, giving you more time to play without feeling rushed.</p>

<h3>Rent Equipment First</h3>
<p>Before investing in your own clubs, rent equipment at the pro shop. This lets you try different clubs and understand what suits your game.</p>

<h2>Finding Playing Partners</h2>

<p>One of the best ways to improve as a beginner is to play with more experienced golfers who can offer tips and encouragement. French Riviera Golf connects players of all levels – simply create a profile indicating you're a beginner, and you'll find welcoming partners who remember what it was like to start out.</p>

<h2>Conclusion</h2>

<p>The French Riviera offers a wonderful environment to learn golf. The Mediterranean climate means you can play year-round, and the welcoming culture at many clubs means you'll feel comfortable from your first tee shot. Don't be intimidated by the glamorous reputation – every great golfer started somewhere, and the Côte d'Azur is a beautiful place to begin your journey.</p>
`
    },
    {
        slug: 'planning-golf-holiday-cote-azur',
        title: 'Planning the Perfect Golf Holiday on the Côte d\'Azur',
        excerpt: 'Everything you need to know to plan an unforgettable golf trip to the French Riviera. Best time to visit, where to stay, and how to book.',
        category: 'Travel',
        author: 'French Riviera Golf',
        meta_description: 'Plan your perfect golf holiday on the French Riviera. Best time to visit, accommodation tips, course recommendations, and insider advice for the Côte d\'Azur.',
        content: `
<p>A golf holiday on the French Riviera combines world-class courses with Mediterranean glamour, exceptional cuisine, and year-round sunshine. Here's everything you need to know to plan the perfect trip.</p>

<h2>Best Time to Visit</h2>

<p>The French Riviera enjoys over 300 days of sunshine per year, making it a year-round golf destination. However, each season offers something different:</p>

<h3>Spring (April - June)</h3>
<p>Ideal golfing weather with temperatures between 18-25°C. Courses are in excellent condition after winter, and you'll avoid the summer crowds. This is arguably the best time for a golf-focused trip.</p>

<h3>Autumn (September - November)</h3>
<p>Similar to spring, with pleasant temperatures and fewer tourists. The sea is still warm enough for swimming after your round. September is particularly popular among golfers.</p>

<h3>Summer (July - August)</h3>
<p>Hot temperatures (28-32°C) make early morning or late afternoon tee times preferable. Book well in advance as this is peak tourist season.</p>

<h3>Winter (December - March)</h3>
<p>Mild temperatures (10-15°C) allow for comfortable golf. Many courses offer reduced green fees, and you'll have courses nearly to yourself. A great choice for escaping northern European winters.</p>

<h2>Where to Stay</h2>

<h3>Cannes Area</h3>
<p>Stay here for the highest concentration of courses. Mougins and Mandelieu-La-Napoule put you within 20 minutes of at least 6 excellent courses. The town of Cannes offers great restaurants and nightlife after your round.</p>

<h3>Nice</h3>
<p>The ideal base for combining golf with sightseeing. Easy access to Monaco's Monte-Carlo Golf Club, plus courses in the hills above the city. Nice's old town and Promenade des Anglais are perfect for rest days.</p>

<h3>Saint-Tropez</h3>
<p>For a more exclusive experience, base yourself in the Var department. Fewer courses, but exceptional quality and the legendary Saint-Tropez atmosphere.</p>

<h2>How Many Courses Can You Play?</h2>

<p>A typical golf holiday schedule:</p>

<ul>
<li><strong>3-night stay:</strong> 2-3 rounds comfortably</li>
<li><strong>5-night stay:</strong> 4-5 rounds with rest days</li>
<li><strong>7-night stay:</strong> 5-6 rounds, perfect for exploring multiple areas</li>
</ul>

<p>Don't over-schedule. Leave time to enjoy the region's other attractions – the food, the beaches, the villages.</p>

<h2>Green Fee Budget</h2>

<p>Green fees on the French Riviera range widely:</p>

<ul>
<li><strong>Budget courses:</strong> €50-80</li>
<li><strong>Mid-range:</strong> €80-150</li>
<li><strong>Premium courses:</strong> €150-300</li>
</ul>

<p>Many courses offer twilight rates (typically after 2pm or 3pm) at 30-50% discount. Multi-round packages can also provide savings.</p>

<h2>Getting Around</h2>

<p>A rental car is highly recommended. While Nice has excellent public transport, most golf courses are in the hills and countryside where buses are infrequent. Parking is free at virtually all courses.</p>

<h3>From Nice Airport</h3>
<ul>
<li>Cannes area courses: 30-45 minutes</li>
<li>Monaco area: 30 minutes</li>
<li>Saint-Tropez area: 90 minutes</li>
</ul>

<h2>What to Pack</h2>

<ul>
<li>Smart casual golf attire (most courses have dress codes)</li>
<li>Soft spikes (some courses don't allow metal)</li>
<li>Sun protection (hat, sunscreen, sunglasses)</li>
<li>Light layers for early morning rounds</li>
<li>Waterproof jacket (occasional showers, especially in spring)</li>
</ul>

<h2>Booking Tee Times</h2>

<p>Book at least 1-2 weeks in advance for popular courses, especially in high season. Many courses allow online booking through their websites. For the most prestigious private clubs, you may need a letter of introduction from your home club.</p>

<h2>Finding Playing Partners</h2>

<p>Traveling solo or want to meet local golfers? French Riviera Golf connects you with players across the region. Create a game posting or mark yourself as available, and you'll find partners who know the courses and can share insider tips.</p>

<h2>Beyond Golf</h2>

<p>Don't miss the region's other attractions:</p>

<ul>
<li>Michelin-starred restaurants throughout the region</li>
<li>Medieval villages like Èze and Saint-Paul-de-Vence</li>
<li>Monaco's casino and Prince's Palace</li>
<li>Cannes Film Festival (May) atmosphere</li>
<li>Beach clubs along the coast</li>
<li>Wine tasting in Provence</li>
</ul>

<h2>Start Planning</h2>

<p>The French Riviera offers an unmatched combination of exceptional golf, Mediterranean lifestyle, and world-famous hospitality. Whether you're planning a dedicated golf trip or adding a few rounds to a family holiday, the Côte d'Azur delivers an unforgettable experience.</p>
`
    },
    {
        slug: 'history-golf-french-riviera',
        title: 'The Rich History of Golf on the French Riviera',
        excerpt: 'From aristocratic beginnings to modern championship venues, discover how golf became part of the French Riviera\'s glamorous identity.',
        category: 'History',
        author: 'French Riviera Golf',
        meta_description: 'Explore the fascinating history of golf on the French Riviera, from the first courses in the 1890s to today\'s world-class championship venues.',
        content: `
<p>Golf on the French Riviera has a history as glamorous as the region itself. From Russian royalty to European Tour champions, the Côte d'Azur has been attracting golfers for over 130 years.</p>

<h2>The Birth of Riviera Golf (1890s)</h2>

<p>Golf arrived on the French Riviera in the late 19th century, brought by the British aristocracy who wintered on the Côte d'Azur. The mild Mediterranean climate offered a perfect escape from the harsh British winters, and these wealthy visitors wanted to continue playing their beloved game.</p>

<h3>Old Course Mandelieu (1891)</h3>
<p>The story begins with the Old Course Golf Club de Mandelieu, created in 1891 by Grand Duke Michael of Russia. This makes it one of the oldest golf courses in France and the oldest on the Riviera. The Grand Duke, uncle to Tsar Nicholas II, fell in love with the region and established the course to entertain his fellow aristocratic exiles.</p>

<p>The course has hosted kings, queens, and celebrities throughout its history, maintaining its old-world charm while evolving with the game.</p>

<h2>The Golden Age (1900-1930)</h2>

<p>The early 20th century saw an explosion of golf on the Riviera, coinciding with the region's emergence as the world's most fashionable winter resort.</p>

<h3>Monte-Carlo Golf Club (1911)</h3>
<p>Perched at 900 meters altitude in La Turbie, with breathtaking views over Monaco and the Mediterranean, the Monte-Carlo Golf Club was designed by Willie Park Jr., a two-time Open Championship winner. The course attracted royalty and celebrities from across Europe, cementing the Riviera's reputation as a playground for the elite.</p>

<h3>Cannes-Mougins (1923)</h3>
<p>What began as a modest course would grow into one of Europe's most prestigious venues. The club's history is intertwined with golf legends – it would later host the European Tour for 14 consecutive years.</p>

<h3>Golf de Biot (1930)</h3>
<p>Originally called Golf de la Bastide du Roy, this course was created at the foot of the famous glass-blowing village of Biot. Designed by James Peter Gannon and Percy Boomer (one of the era's leading instructors), it represented the artistic sensibility of the region.</p>

<h2>Post-War Renaissance (1950s-1980s)</h2>

<p>After World War II, the French Riviera reinvented itself as a summer destination, and golf evolved alongside it. New courses were built to accommodate the growing demand from tourists and an emerging French middle class interested in the sport.</p>

<p>This era saw the construction of:</p>
<ul>
<li>Royal Mougins Golf Club</li>
<li>Golf de Saint-Donat</li>
<li>Riviera Golf de Barbossi</li>
</ul>

<h2>The European Tour Era (1980s-2000s)</h2>

<p>The French Riviera's golf profile reached new heights when the European Tour came to town. The Cannes Open became a fixture on the tour calendar, hosted at Cannes-Mougins from 1984 to 1997.</p>

<h3>Champions Who Conquered the Riviera</h3>
<ul>
<li><strong>Seve Ballesteros</strong> - Won at Cannes-Mougins, showcasing his legendary short game</li>
<li><strong>Ian Woosnam</strong> - Triumphed here before his Masters victory</li>
<li><strong>Greg Norman</strong> - The Great White Shark added Cannes to his worldwide victories</li>
</ul>

<p>These tournaments brought international attention and raised the standard of Riviera golf courses to championship level.</p>

<h2>Modern Era (2000-Present)</h2>

<p>Today's French Riviera golf scene blends historic charm with modern luxury. Major developments include:</p>

<h3>Terre Blanche (2004)</h3>
<p>This Four Seasons resort near Tourrettes features two Dave Thomas-designed courses. The Château course has hosted the Senior European Tour's French Riviera Masters and represents the region's commitment to world-class golf.</p>

<h3>Environmental Leadership</h3>
<p>Modern Riviera courses are pioneers in sustainable golf. Terre Blanche became one of the first courses worldwide to receive GEO certification for environmental management. Water conservation and biodiversity protection are now central to course management.</p>

<h2>Legendary Architects</h2>

<p>The French Riviera has attracted golf's greatest course designers:</p>

<ul>
<li><strong>Willie Park Jr.</strong> - Monte-Carlo Golf Club</li>
<li><strong>Robert Trent Jones Sr.</strong> - Riviera Golf de Barbossi, Estérel Latitudes</li>
<li><strong>Robert Trent Jones Jr.</strong> - Golf de Saint-Donat</li>
<li><strong>Gary Player</strong> - Château de Taulane, Golf de Saint-Tropez</li>
<li><strong>Dave Thomas</strong> - Terre Blanche, Cannes-Mougins renovation</li>
<li><strong>Pete Dye</strong> - Golf de Barbaroux</li>
</ul>

<h2>Golf and Glamour</h2>

<p>Throughout its history, Riviera golf has attracted celebrities and dignitaries:</p>

<ul>
<li>The Duke of Windsor was a regular at several courses</li>
<li>Sean Connery played during film shoots in the region</li>
<li>Modern celebrities continue to be spotted on Riviera fairways</li>
</ul>

<p>This blend of sporting excellence and social cachet defines the unique character of French Riviera golf.</p>

<h2>The Future</h2>

<p>Today, the French Riviera offers over 20 courses within an hour of Nice. The region continues to evolve, with courses investing in sustainability, technology, and player experience while honoring their rich heritage.</p>

<p>Whether you're walking the same fairways as Russian Grand Dukes or European Tour champions, golf on the French Riviera connects you to a remarkable tradition that spans more than a century.</p>
`
    },
    {
        slug: 'top-scenic-golf-courses-french-riviera',
        title: 'Top 5 Most Scenic Golf Courses on the French Riviera',
        excerpt: 'From mountain panoramas to Mediterranean views, these courses offer the most breathtaking scenery on the Côte d\'Azur.',
        category: 'Guides',
        author: 'French Riviera Golf',
        meta_description: 'Discover the 5 most scenic golf courses on the French Riviera. Stunning views of the Mediterranean, Alps, and Provençal landscapes.',
        content: `
<p>The French Riviera is blessed with extraordinary natural beauty, and its golf courses take full advantage of the dramatic landscapes. From Alpine vistas to Mediterranean panoramas, here are the five most scenic courses on the Côte d'Azur.</p>

<h2>1. Monte-Carlo Golf Club, La Turbie</h2>

<p><strong>The View:</strong> Perched at 900 meters altitude, this course offers a 360-degree panorama that's simply unmatched. Look down over the principality of Monaco, the Mediterranean stretching to the horizon, and on clear days, glimpse the Italian coastline and the mountains of Corsica.</p>

<p><strong>The Experience:</strong> Playing here feels like being on top of the world. The cooler mountain air provides relief from summer heat, while the views can be genuinely distracting – you'll find yourself pausing mid-swing to take it all in.</p>

<p><strong>Best Holes for Views:</strong> The entire course delivers, but holes along the southern edge offer the most dramatic Mediterranean vistas.</p>

<p><strong>When to Play:</strong> Early morning offers the clearest views, before any afternoon haze develops.</p>

<h2>2. Château de Taulane, La Martre</h2>

<p><strong>The View:</strong> Set at 1,000 meters altitude in the foothills of the Alps, with the dramatic Gorges du Verdon nearby. Snow-capped peaks frame the course in winter and spring, while the pristine mountain environment provides a sense of total escape.</p>

<p><strong>The Experience:</strong> This Gary Player design feels like discovering a hidden gem. The complete tranquility and mountain setting make it unlike any other course on the Riviera. It's golf in the wilderness, yet with immaculate conditions.</p>

<p><strong>Best Holes for Views:</strong> Several holes offer views toward the Verdon canyon, one of Europe's most spectacular natural wonders.</p>

<p><strong>When to Play:</strong> Late spring through early autumn. The course may close during winter months due to altitude.</p>

<h2>3. Golf de Saint-Tropez, Gassin</h2>

<p><strong>The View:</strong> This Gary Player masterpiece sits in a protected landscape with views across to the medieval villages of Gassin, Grimaud, and Ramatuelle. The Gulf of Saint-Tropez sparkles in the distance, while the Maures mountains provide a dramatic backdrop.</p>

<p><strong>The Experience:</strong> The course blends seamlessly into its environment, with umbrella pines, cork oaks, and Mediterranean scrub framing each hole. The massive 1,600m² Provençal clubhouse adds to the sense of occasion.</p>

<p><strong>Best Holes for Views:</strong> The back nine offers particularly stunning vistas toward the sea and surrounding villages.</p>

<p><strong>When to Play:</strong> Spring and autumn offer the best combination of weather and scenery, with wildflowers in spring adding extra color.</p>

<h2>4. Riviera Golf de Barbossi, Mandelieu</h2>

<p><strong>The View:</strong> Robert Trent Jones Sr. designed this course on the heights above Cannes bay, offering sweeping views of the red rocks of the Estérel massif, the Mediterranean, and the Domaine's own vineyards.</p>

<p><strong>The Experience:</strong> What sets Barbossi apart is its unique combination of golf and art. Contemporary sculptures dot the course, creating unexpected moments of beauty alongside the natural scenery. The vineyard setting adds a distinctly Provençal character.</p>

<p><strong>Best Holes for Views:</strong> Elevated tees throughout the course provide panoramic perspectives of the coast and mountains.</p>

<p><strong>When to Play:</strong> Sunset rounds are particularly magical, with the Estérel rocks glowing red in the evening light.</p>

<h2>5. Terre Blanche (Château Course), Tourrettes</h2>

<p><strong>The View:</strong> Set within a 300-hectare estate in the Provençal hills, this course offers classic French countryside scenery – rolling hills covered in lavender and olive groves, ancient stone walls, and cypress-lined fairways.</p>

<p><strong>The Experience:</strong> While lacking sea views, Terre Blanche delivers quintessential Provence. The immaculate conditioning, combined with the luxury Four Seasons resort, creates an experience of refined beauty throughout.</p>

<p><strong>Best Holes for Views:</strong> The course flows through natural valleys and over ridges, with each hole offering a new perspective on the landscape.</p>

<p><strong>When to Play:</strong> June-July when the lavender blooms, or autumn when the light turns golden.</p>

<h2>Honorable Mentions</h2>

<h3>Golf de Roquebrune</h3>
<p>Spectacular views of the Maures massif from an elevated position between Cannes and Saint-Tropez.</p>

<h3>Golf de Saint-Endréol</h3>
<p>The River Endre winds through the course, with the imposing Rocher de Roquebrune providing a dramatic focal point.</p>

<h2>Photography Tips</h2>

<p>These courses demand to be photographed. A few tips:</p>

<ul>
<li>Morning light is generally best for Mediterranean views (less haze)</li>
<li>Bring a small camera that won't slow your round</li>
<li>Ask playing partners before taking photos during their shots</li>
<li>The best photos often come from tees and greens, not during your swing</li>
</ul>

<h2>Beyond the Fairways</h2>

<p>Each of these courses offers excellent dining options where you can enjoy the views without a golf club in hand. Make time for lunch or drinks at the clubhouse – on the French Riviera, lingering over good food with a beautiful view is part of the experience.</p>

<h2>Play These Courses</h2>

<p>Ready to experience these stunning courses? Create a free account on French Riviera Golf to find playing partners and get insider tips from locals who know every scenic viewpoint.</p>
`
    },
    {
        slug: 'golf-etiquette-french-riviera',
        title: 'Golf Etiquette on the French Riviera: What You Need to Know',
        excerpt: 'From dress codes to pace of play, understand the customs and expectations at French Riviera golf clubs.',
        category: 'Tips',
        author: 'French Riviera Golf',
        meta_description: 'Learn the essential golf etiquette for French Riviera courses. Dress codes, pace of play, and customs to ensure a great experience on the Côte d\'Azur.',
        content: `
<p>French Riviera golf clubs maintain traditions that reflect the region's elegant character. Understanding local etiquette ensures you'll feel comfortable and welcome at any course on the Côte d'Azur.</p>

<h2>Dress Code</h2>

<p>French Riviera courses generally have dress codes, though enforcement varies by club. Here's what to expect:</p>

<h3>On the Course</h3>
<ul>
<li><strong>Shirts:</strong> Collared shirts required at most clubs. Golf-specific polo shirts are ideal.</li>
<li><strong>Trousers/Shorts:</strong> Tailored golf trousers or smart shorts (above the knee is fine). No denim, cargo shorts, or athletic wear.</li>
<li><strong>Shoes:</strong> Golf shoes required, soft spikes strongly preferred. Some courses don't allow metal spikes.</li>
<li><strong>Hats:</strong> Caps and visors are fine, but remove them in the clubhouse.</li>
</ul>

<h3>In the Clubhouse</h3>
<ul>
<li>Smart casual attire expected</li>
<li>Remove hats indoors</li>
<li>Change out of golf shoes before entering restaurants</li>
<li>At prestigious clubs, jacket may be required for dinner</li>
</ul>

<h3>What to Avoid</h3>
<ul>
<li>Jeans or denim of any color</li>
<li>Collarless t-shirts</li>
<li>Football shirts or sportswear</li>
<li>Flip-flops or sandals</li>
<li>Swimwear (even at resort courses)</li>
</ul>

<h2>Pace of Play</h2>

<p>The French approach to pace of play balances efficiency with enjoyment. Rushing is considered poor form, but neither is holding up other players.</p>

<h3>Expected Round Times</h3>
<ul>
<li><strong>18 holes:</strong> 4 to 4.5 hours</li>
<li><strong>9 holes:</strong> 2 hours</li>
</ul>

<h3>Tips for Good Pace</h3>
<ul>
<li>Play ready golf – be prepared to hit when it's safe, don't always wait for the farthest player</li>
<li>Limit practice swings to one or two</li>
<li>Walk briskly between shots</li>
<li>Read putts while others are playing</li>
<li>Leave the green promptly, mark scorecards at the next tee</li>
<li>If you fall behind, let faster groups play through</li>
</ul>

<h2>On the Tee</h2>

<h3>Starting Your Round</h3>
<ul>
<li>Arrive at least 30 minutes before your tee time</li>
<li>Check in at the pro shop</li>
<li>Be on the first tee 5-10 minutes early</li>
<li>Introduce yourself to playing partners if you don't know them</li>
</ul>

<h3>Tee Box Etiquette</h3>
<ul>
<li>Stand still and quiet when others are hitting</li>
<li>Position yourself out of the player's peripheral vision</li>
<li>Don't stand directly behind the ball</li>
<li>Replace divots or use the seed mix provided</li>
</ul>

<h2>On the Fairway</h2>

<ul>
<li>Repair all divots – use seed mix where provided</li>
<li>Keep carts on designated paths when required</li>
<li>Don't drive carts near greens or tees</li>
<li>Rake bunkers after use, leaving the rake as indicated by club policy</li>
<li>Shout "Fore!" loudly if your ball might hit someone</li>
</ul>

<h2>On the Green</h2>

<ul>
<li>Repair pitch marks – yours and any others you see</li>
<li>Don't step on other players' putting lines</li>
<li>Don't stand in anyone's line of sight while they putt</li>
<li>Tend the flag if asked, remove it when all players are on the green</li>
<li>Leave the green promptly once all players have holed out</li>
</ul>

<h2>Language Considerations</h2>

<p>While English is widely spoken at Riviera courses, a few French phrases show respect:</p>

<ul>
<li><strong>"Bonjour"</strong> – Hello (until evening, then "Bonsoir")</li>
<li><strong>"Merci"</strong> – Thank you</li>
<li><strong>"Bonne partie"</strong> – Have a good round</li>
<li><strong>"Bien joué"</strong> – Well played</li>
<li><strong>"Attention"</strong> – Watch out (equivalent of "Fore!")</li>
</ul>

<p>Don't worry about being fluent – attempts at French are appreciated, and staff will happily switch to English.</p>

<h2>Mobile Phones</h2>

<ul>
<li>Set phones to silent before reaching the first tee</li>
<li>Keep calls brief and away from other players</li>
<li>Photography is usually fine, but ask before photographing other players</li>
<li>Never use phones on the green</li>
</ul>

<h2>Caddie Etiquette</h2>

<p>Some prestigious clubs offer caddie services:</p>

<ul>
<li>Listen to their advice – they know the course intimately</li>
<li>Tip appropriately (€30-50 for 18 holes is standard)</li>
<li>Treat them with respect; many are experienced golfers themselves</li>
</ul>

<h2>At the 19th Hole</h2>

<p>Post-round drinks are a cherished tradition on the Riviera:</p>

<ul>
<li>Offer to buy a round for your playing partners</li>
<li>Keep golf talk positive – avoid lengthy post-mortems of every bad shot</li>
<li>Thank your partners for the game</li>
<li>Settle any bets gracefully</li>
</ul>

<h2>Tipping Culture</h2>

<p>Tipping in France is more modest than in some countries:</p>

<ul>
<li><strong>Caddies:</strong> €30-50 for 18 holes</li>
<li><strong>Bag drop/cleaning:</strong> €2-5</li>
<li><strong>Locker room attendants:</strong> €1-2 if they assist you</li>
<li><strong>Restaurants:</strong> 5-10% for exceptional service (service charge usually included)</li>
</ul>

<h2>The Spirit of the Game</h2>

<p>Above all, French Riviera golf embodies the spirit of the game – honesty, respect, and enjoyment. Call penalties on yourself, congratulate good shots from your partners, and remember that even on the most prestigious courses, we're all here to enjoy ourselves.</p>

<p>Welcome to golf on the Côte d'Azur. Play well, play fair, and savour every moment.</p>
`
    }
];

async function seedBlog() {
    console.log('Seeding blog posts...\n');

    for (const post of blogPosts) {
        try {
            // Check if post already exists
            const existing = await db.query(
                'SELECT id FROM blog_posts WHERE slug = $1',
                [post.slug]
            );

            if (existing.rows.length > 0) {
                console.log(`✓ Skipping "${post.title}" (already exists)`);
                continue;
            }

            await db.query(
                `INSERT INTO blog_posts (slug, title, excerpt, content, category, featured_image, meta_description, author, published, published_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())`,
                [post.slug, post.title, post.excerpt, post.content, post.category, post.featured_image || null, post.meta_description, post.author]
            );
            console.log(`✓ Created "${post.title}"`);
        } catch (err) {
            console.error(`✗ Error creating "${post.title}":`, err.message);
        }
    }

    console.log('\nBlog seeding complete!');
    process.exit(0);
}

seedBlog();
