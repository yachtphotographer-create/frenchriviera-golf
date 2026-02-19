require('dotenv').config({ quiet: true });
const db = require('../config/database');

const blogPosts = [
    {
        slug: "best-golf-courses-french-riviera-2024",
        title: "Top 10 Best Golf Courses on the French Riviera",
        excerpt: "Discover the finest golf courses on the Côte d'Azur, from historic Monte-Carlo to luxurious Terre Blanche. Our expert guide to the best golfing experiences.",
        category: "Course Guides",
        meta_description: "Discover the top 10 best golf courses on the French Riviera. From Monte-Carlo to Saint-Tropez, find your perfect course on the Côte d'Azur.",
        content: `
<p>The French Riviera is home to some of Europe's most spectacular golf courses. With year-round sunshine, stunning Mediterranean views, and world-class facilities, it's no wonder golfers flock to the Côte d'Azur. Here's our guide to the top 10 courses you must play.</p>

<h2>1. Monte-Carlo Golf Club, La Turbie</h2>
<p>Perched at 900 meters altitude above Monaco, this historic course offers breathtaking views of the Mediterranean. Designed by Willie Park Jr in 1911, it's one of the oldest and most prestigious courses in the region. The challenging mountain layout rewards accurate shot-making.</p>
<p><strong>Why play here:</strong> Unmatched views of Monaco, historic pedigree, challenging layout.</p>

<h2>2. Terre Blanche - Château Course, Tourrettes</h2>
<p>This Dave Thomas-designed championship course is consistently ranked among Europe's finest. Part of a 5-star resort, it offers impeccable conditioning and the renowned Albatros Golf Performance Centre.</p>
<p><strong>Why play here:</strong> Championship quality, pristine conditions, luxury resort experience.</p>

<h2>3. Royal Mougins Golf Club</h2>
<p>A Robert von Hagge masterpiece nestled in the hills above Cannes. The course winds through Mediterranean vegetation with strategic water features. Note: access is reserved for members and hotel guests.</p>
<p><strong>Why play here:</strong> World Top 1000 course, exclusive experience, beautiful setting.</p>

<h2>4. Golf de Saint-Tropez, Gassin</h2>
<p>Gary Player designed this stunning course with panoramic views of the Saint-Tropez peninsula. The massive Provençal clubhouse is a destination in itself. Perfect for combining golf with the glamour of Saint-Tropez.</p>
<p><strong>Why play here:</strong> Celebrity atmosphere, Gary Player design, Provençal charm.</p>

<h2>5. Cannes-Mougins Golf Country Club</h2>
<p>Historic course established in 1923 that hosted 14 years of the Cannes Open. Winners include Greg Norman, Ian Woosnam, and Seve Ballesteros. Set in the beautiful Parc de Valmasque Forest.</p>
<p><strong>Why play here:</strong> Tournament history, forest setting, proven championship layout.</p>

<h2>6. Old Course Golf Club Mandelieu</h2>
<p>One of France's oldest courses, created in 1891 by the Grand Duke Michel of Russia. This historic gem offers a unique glimpse into golf's past on the Riviera. A must-play for golf history enthusiasts.</p>
<p><strong>Why play here:</strong> Historic significance, affordable green fees, walkable layout.</p>

<h2>7. Golf de Saint Endréol, La Motte</h2>
<p>Rated 14th in France's Top 50 by Golf Européen. The picturesque setting includes parasol pines, the River Endre, and the imposing Rocher de Roquebrune. Excellent value for a top-rated course.</p>
<p><strong>Why play here:</strong> Top 50 ranking, dramatic scenery, great value.</p>

<h2>8. Château de Taulane, La Martre</h2>
<p>A hidden gem designed by Gary Player at 1000 meters altitude in the Gorges du Verdon. Absolute tranquility with breathtaking mountain views. Worth the drive from the coast.</p>
<p><strong>Why play here:</strong> Mountain setting, complete serenity, Gary Player design.</p>

<h2>9. Golf de Barbaroux, Brignoles</h2>
<p>Pete Dye and P.B. Dye created this challenging championship course in the Provençal countryside. Expect strategic carries and demanding shot selection typical of Dye designs.</p>
<p><strong>Why play here:</strong> Legendary Dye design, championship challenge, countryside beauty.</p>

<h2>10. Riviera Golf de Barbossi, Mandelieu</h2>
<p>Robert Trent Jones Sr designed this unique course featuring contemporary sculptures throughout the fairways. Stunning views of the Estérel massif and on-site vineyard complete the experience.</p>
<p><strong>Why play here:</strong> Art meets golf, RTJ Sr design, vineyard setting.</p>

<h2>Planning Your French Riviera Golf Trip</h2>
<p>The best time to play is spring (April-June) or autumn (September-November) when temperatures are perfect and courses are in prime condition. Many courses offer stay-and-play packages with nearby hotels.</p>

<p>Ready to play? <a href="/auth/register">Create a free account</a> to find playing partners for your French Riviera golf adventure.</p>
`
    },
    {
        slug: "golf-tips-beginners-french-riviera",
        title: "Golf Tips for Beginners: Your First Round on the French Riviera",
        excerpt: "New to golf? Our comprehensive guide covers everything you need to know before playing your first round on the Côte d'Azur.",
        category: "Tips & Advice",
        meta_description: "Essential golf tips for beginners planning to play on the French Riviera. Learn about etiquette, dress codes, and the best beginner-friendly courses.",
        content: `
<p>Playing your first round of golf on the French Riviera is an exciting experience. The stunning scenery and welcoming atmosphere make it an ideal place to start your golf journey. Here's everything you need to know.</p>

<h2>Choosing the Right Course</h2>
<p>Not all courses are equally suited to beginners. Here are our top recommendations for new golfers:</p>
<ul>
<li><strong>Nice Golf Country Club</strong> - A friendly 9-hole course just 10 minutes from Nice. Perfect for beginners with its short layout and relaxed atmosphere.</li>
<li><strong>Golf de la Grande Bastide</strong> - Accessible 18-hole course welcoming to all skill levels.</li>
<li><strong>Golf Claux-Amic</strong> - Good practice facilities and a forgiving layout for newcomers.</li>
</ul>

<h2>Understanding Dress Codes</h2>
<p>French Riviera courses generally expect:</p>
<ul>
<li>Collared shirt (polo shirt)</li>
<li>Tailored shorts or trousers (no jeans)</li>
<li>Golf shoes (soft spikes preferred)</li>
<li>No t-shirts, flip-flops, or athletic wear</li>
</ul>
<p>When in doubt, dress smart casual. It's better to be slightly overdressed than turned away at the clubhouse.</p>

<h2>Essential Etiquette Tips</h2>
<p>Golf has unwritten rules that keep the game enjoyable for everyone:</p>
<ul>
<li><strong>Pace of play</strong> - Keep up with the group ahead. If you're struggling, pick up your ball after double par.</li>
<li><strong>Repair divots and ball marks</strong> - Always repair any damage you cause to the course.</li>
<li><strong>Quiet please</strong> - Never talk or move while someone is playing their shot.</li>
<li><strong>Safety first</strong> - Only play when the group ahead is out of range. Shout "Fore!" if your ball heads toward anyone.</li>
<li><strong>Let faster groups through</strong> - If you're holding up play, invite the group behind to pass.</li>
</ul>

<h2>What to Bring</h2>
<ul>
<li>Golf clubs (can be rented at most courses)</li>
<li>Golf balls (bring plenty as a beginner!)</li>
<li>Tees and ball markers</li>
<li>Sunscreen and sunglasses</li>
<li>Water bottle</li>
<li>Light jacket (mountain courses can be cooler)</li>
</ul>

<h2>Booking Tips</h2>
<ul>
<li>Book tee times in advance, especially in peak season</li>
<li>Arrive 30-45 minutes early to warm up</li>
<li>Consider booking a playing lesson with a pro</li>
<li>Ask about beginner packages that include equipment rental</li>
</ul>

<h2>Finding Playing Partners</h2>
<p>Golf is more fun with company. As a beginner, playing with patient, experienced golfers can accelerate your learning. <a href="/auth/register">Join French Riviera Golf</a> to connect with welcoming players who enjoy introducing newcomers to the game.</p>

<p>Remember, everyone was a beginner once. Most golfers are happy to offer tips and encouragement. Enjoy the journey!</p>
`
    },
    {
        slug: "best-time-play-golf-cote-azur",
        title: "Best Time to Play Golf on the Côte d'Azur: A Seasonal Guide",
        excerpt: "When is the ideal time for a golf trip to the French Riviera? Our seasonal breakdown helps you plan the perfect visit.",
        category: "Travel Guide",
        meta_description: "Find the best time to play golf on the French Riviera. Seasonal weather guide, green fee tips, and booking advice for the Côte d'Azur.",
        content: `
<p>The French Riviera enjoys over 300 days of sunshine per year, making it a year-round golf destination. However, each season offers a different experience. Here's when to visit based on your priorities.</p>

<h2>Spring (March - May): The Sweet Spot</h2>
<p><strong>Weather:</strong> 15-22°C, occasional showers in March</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Perfect playing temperatures</li>
<li>Courses in excellent condition after winter maintenance</li>
<li>Fewer crowds than summer</li>
<li>Wildflowers in bloom throughout the region</li>
<li>Moderate green fees</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Easter period can be busy</li>
<li>Some rain possible in early spring</li>
</ul>
<p><strong>Verdict:</strong> Our top recommendation for serious golfers.</p>

<h2>Summer (June - August): The Glamour Season</h2>
<p><strong>Weather:</strong> 25-32°C, very little rain</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Guaranteed sunshine</li>
<li>Long daylight hours - play until 8pm</li>
<li>Vibrant atmosphere, beach clubs, events</li>
<li>Perfect for combining golf with family holiday</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Peak green fees</li>
<li>Crowded courses - book well ahead</li>
<li>Afternoon heat can be intense</li>
<li>Tourist traffic on roads</li>
</ul>
<p><strong>Verdict:</strong> Book early morning tee times to beat the heat. Best for those wanting the full Riviera experience.</p>

<h2>Autumn (September - November): The Local's Favourite</h2>
<p><strong>Weather:</strong> 18-25°C, occasional storms in October</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Ideal temperatures for golf</li>
<li>Summer crowds have departed</li>
<li>Reduced green fees at many courses</li>
<li>Sea still warm for post-golf swimming</li>
<li>Grape harvest season - wine tours!</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Occasional Mediterranean storms</li>
<li>Shorter days from late October</li>
</ul>
<p><strong>Verdict:</strong> Excellent value and conditions. Our second-favourite season.</p>

<h2>Winter (December - February): The Escape</h2>
<p><strong>Weather:</strong> 10-15°C, mostly dry</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Lowest green fees of the year</li>
<li>No crowds whatsoever</li>
<li>Still much warmer than Northern Europe</li>
<li>Easy tee time availability</li>
<li>Combine with skiing in the Alps (90 mins away)</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Some courses closed for maintenance</li>
<li>Cooler temperatures, especially at altitude</li>
<li>Shorter days</li>
<li>Some resort facilities may be closed</li>
</ul>
<p><strong>Verdict:</strong> Great for budget-conscious golfers escaping Northern European winter.</p>

<h2>Our Recommendation</h2>
<p>For the best overall experience, visit in <strong>late April to early June</strong> or <strong>mid-September to mid-October</strong>. You'll enjoy perfect weather, excellent course conditions, and reasonable prices.</p>

<p>Whatever season you choose, <a href="/auth/register">connect with local players</a> who can share insider knowledge and join you for a round.</p>
`
    },
    {
        slug: "how-to-find-golf-partners-french-riviera",
        title: "How to Find Golf Partners on the French Riviera",
        excerpt: "Travelling solo or looking for new playing partners? Here's how to connect with golfers on the Côte d'Azur.",
        category: "Tips & Advice",
        meta_description: "Find golf playing partners on the French Riviera. Tips for solo golfers, joining groups, and making connections on the Côte d'Azur.",
        content: `
<p>Golf is better with company, but finding compatible playing partners can be challenging, especially when travelling. Here's how to connect with fellow golfers on the French Riviera.</p>

<h2>The Challenge of Solo Golf Travel</h2>
<p>Many golfers visit the Riviera alone or with non-golfing partners. Playing solo can mean:</p>
<ul>
<li>Being paired with random groups</li>
<li>Higher green fees (groups often get better rates)</li>
<li>Missing the social aspect of the game</li>
<li>No one to share recommendations or experiences</li>
</ul>

<h2>Traditional Options</h2>
<h3>Ask the Pro Shop</h3>
<p>Most courses can pair you with other golfers. However, there's no guarantee of compatibility - you might end up with players of very different skill levels or playing styles.</p>

<h3>Hotel Concierge</h3>
<p>If staying at a golf resort, the concierge may know of other guests looking for partners. This works best at dedicated golf hotels.</p>

<h3>Golf Tour Operators</h3>
<p>Organised golf trips include ready-made playing groups, but at a premium price and with less flexibility.</p>

<h2>The Modern Solution: French Riviera Golf</h2>
<p>We built <a href="/">French Riviera Golf</a> specifically to solve this problem. Here's how it works:</p>

<h3>1. Create Your Profile</h3>
<p>Set up your golf profile with your handicap, preferred pace of play, and what you're looking for in playing partners.</p>

<h3>2. Find or Create Games</h3>
<p>Browse open games at courses you want to play, or create your own tee time and invite others to join.</p>

<h3>3. Set Your Availability</h3>
<p>Mark dates when you're free to play. Other golfers looking for partners can find and invite you.</p>

<h3>4. Connect and Coordinate</h3>
<p>Once matched, use the group chat to coordinate details - transportation, lunch plans, practice time.</p>

<h3>5. Build Your Network</h3>
<p>Rate playing partners after each round. Over time, you'll build a network of compatible golfers for future rounds.</p>

<h2>Tips for Finding Great Partners</h2>
<ul>
<li><strong>Be specific in your profile</strong> - Mention your playing style, pace preference, and what you enjoy about golf.</li>
<li><strong>Be flexible</strong> - Open yourself to different courses and times for more opportunities.</li>
<li><strong>Communicate clearly</strong> - Discuss expectations before the round (competitive vs. social, walking vs. buggy).</li>
<li><strong>Show up prepared</strong> - Arrive on time, know the dress code, bring everything you need.</li>
<li><strong>Be a good partner</strong> - Positive energy, good etiquette, and encouragement go a long way.</li>
</ul>

<h2>Ready to Connect?</h2>
<p><a href="/auth/register">Create your free profile</a> and start finding golf partners on the French Riviera today. Whether you're a local looking for regular playing buddies or a visitor seeking one-off rounds, our community is here to help.</p>
`
    },
    {
        slug: "monte-carlo-golf-club-complete-guide",
        title: "Monte-Carlo Golf Club: The Complete Guide",
        excerpt: "Everything you need to know about playing the legendary Monte-Carlo Golf Club - history, course guide, tips, and booking information.",
        category: "Course Guides",
        meta_description: "Complete guide to Monte-Carlo Golf Club. Course history, hole-by-hole guide, green fees, dress code, and booking tips for this legendary Riviera course.",
        content: `
<p>Perched 900 meters above the Mediterranean, Monte-Carlo Golf Club is one of the most spectacular courses in Europe. Here's everything you need to know before your round.</p>

<h2>History & Heritage</h2>
<p>Founded in 1911, Monte-Carlo Golf Club was designed by Willie Park Jr, a two-time Open Champion. The course was commissioned by the Société des Bains de Mer, the company that operates Monte-Carlo's famous casino. Over a century later, it remains one of the most prestigious clubs on the Riviera.</p>

<h2>The Course</h2>
<p><strong>Holes:</strong> 18<br>
<strong>Par:</strong> 71<br>
<strong>Altitude:</strong> 900m<br>
<strong>Architect:</strong> Willie Park Jr (1911)</p>

<p>The course features dramatic elevation changes, narrow fairways, and small, well-defended greens. The mountain setting means cooler temperatures than the coast - bring an extra layer.</p>

<h2>Standout Holes</h2>
<p><strong>Hole 3 (Par 4):</strong> Stunning views of Monaco below as you play along the clifftop.</p>
<p><strong>Hole 7 (Par 3):</strong> A beautiful downhill par 3 with panoramic Mediterranean views.</p>
<p><strong>Hole 14 (Par 4):</strong> Challenging dogleg with a blind tee shot requiring local knowledge.</p>
<p><strong>Hole 18 (Par 4):</strong> A fitting finale with the historic clubhouse framing the approach.</p>

<h2>Practical Information</h2>
<p><strong>Address:</strong> Route du Mont Agel, 06320 La Turbie</p>
<p><strong>Phone:</strong> +33 4 92 41 50 70</p>
<p><strong>Email:</strong> monte-carlo-golf-club@wanadoo.fr</p>
<p><strong>Website:</strong> golfdemontecarlo.com</p>

<h2>Green Fees</h2>
<p>Green fees range from €130-180 depending on season. Twilight rates are available after 3pm. Club members and guests receive preferential rates.</p>

<h2>Dress Code</h2>
<p>Monte-Carlo maintains strict standards befitting its prestigious reputation:</p>
<ul>
<li>Collared shirts mandatory</li>
<li>Tailored shorts or trousers (no jeans)</li>
<li>Golf shoes with soft spikes</li>
<li>No trainers or casual wear</li>
</ul>

<h2>Insider Tips</h2>
<ul>
<li>Book at least 2 weeks in advance during high season</li>
<li>The front 9 is more forgiving than the challenging back 9</li>
<li>Temperatures can be 5-8°C cooler than on the coast - dress accordingly</li>
<li>Allow extra time for the scenic drive up the mountain road</li>
<li>The restaurant offers stunning views - worth staying for lunch</li>
</ul>

<h2>Getting There</h2>
<p>The club is located in La Turbie, accessible via the Grande Corniche (D2564). From Monaco, it's approximately 20 minutes by car. From Nice, allow 35-40 minutes.</p>

<blockquote>
<p>"Monte-Carlo Golf Club is a pilgrimage every serious golfer should make. The combination of history, challenge, and those unforgettable views creates a truly unique experience."</p>
</blockquote>

<h2>Find Playing Partners</h2>
<p>Looking for companions for your Monte-Carlo round? <a href="/courses/monte-carlo-golf-club">Find available players</a> or <a href="/games/create?course=1">create a game</a> and invite others to join you.</p>
`
    }
];

async function seedBlogPosts() {
    console.log('Seeding blog posts...\n');

    for (const post of blogPosts) {
        try {
            const result = await db.query(
                `INSERT INTO blog_posts (slug, title, excerpt, content, category, meta_description, author, published, published_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
                 ON CONFLICT (slug) DO UPDATE SET
                 title = $2, excerpt = $3, content = $4, category = $5, meta_description = $6, updated_at = NOW()
                 RETURNING title`,
                [post.slug, post.title, post.excerpt, post.content, post.category, post.meta_description, 'French Riviera Golf']
            );

            console.log(`✓ ${result.rows[0].title}`);
        } catch (err) {
            console.error(`Error seeding ${post.slug}:`, err.message);
        }
    }

    console.log('\nDone! Blog posts seeded.');
    process.exit(0);
}

seedBlogPosts();
