require('dotenv').config({ quiet: true });
const { pool } = require('../config/database');

const courseDescriptions = [
    {
        slug: 'monte-carlo-golf-club',
        description_en: `Perched majestically at 900 meters altitude on Mont Agel, the Monte-Carlo Golf Club offers one of the most breathtaking golfing experiences in Europe. Founded in 1911 by Scottish architect Willie Park Jr., this legendary course combines rich heritage with spectacular panoramic views stretching from Monaco's glittering harbor to the azure Mediterranean Sea.

The challenging 18-hole mountain layout winds through fragrant pine forests and rocky outcrops, demanding precision and strategic thinking on every shot. The course's dramatic elevation changes create a unique playing experience where each hole reveals new vistas of the French Riviera coastline below.

As one of the oldest and most prestigious clubs on the Côte d'Azur, Monte-Carlo Golf Club has hosted countless distinguished guests and maintains the elegant atmosphere befitting its royal connections. The clubhouse, a beautifully restored 1920s building, offers refined dining with terrace views that alone are worth the visit.

The cooler mountain air provides welcome relief during summer months, making this an ideal year-round destination. Whether you're a low handicapper seeking a challenge or a visitor wanting to experience golfing history, Monte-Carlo delivers an unforgettable round.`,

        description_fr: `Majestueusement perché à 900 mètres d'altitude sur le Mont Agel, le Monte-Carlo Golf Club offre l'une des expériences de golf les plus époustouflantes d'Europe. Fondé en 1911 par l'architecte écossais Willie Park Jr., ce parcours légendaire allie un riche patrimoine à des vues panoramiques spectaculaires s'étendant du port scintillant de Monaco à la mer Méditerranée azur.

Le parcours de montagne exigeant de 18 trous serpente à travers des forêts de pins parfumés et des affleurements rocheux, exigeant précision et réflexion stratégique à chaque coup. Les changements d'altitude spectaculaires du parcours créent une expérience de jeu unique où chaque trou révèle de nouvelles vues sur la côte de la Riviera française en contrebas.

En tant que l'un des clubs les plus anciens et les plus prestigieux de la Côte d'Azur, le Monte-Carlo Golf Club a accueilli d'innombrables invités distingués et maintient l'atmosphère élégante digne de ses connexions royales. Le clubhouse, un magnifique bâtiment des années 1920 restauré, propose une restauration raffinée avec des vues en terrasse qui valent à elles seules le déplacement.

L'air frais de la montagne offre un répit bienvenu pendant les mois d'été, ce qui en fait une destination idéale toute l'année. Que vous soyez un joueur à faible handicap à la recherche d'un défi ou un visiteur souhaitant vivre l'histoire du golf, Monte-Carlo vous garantit un parcours inoubliable.`
    },
    {
        slug: 'royal-mougins-golf-club',
        description_en: `Royal Mougins Golf Club stands as one of the most exclusive golfing destinations on the French Riviera, consistently ranked among the World Top 1000 courses by the Rolex Guide and within the Top 100 in Continental Europe by Golf World magazine. Designed by acclaimed architect Robert von Hagge, this masterpiece is nestled in the heart of Mediterranean vegetation, where rivers wind between rolling hills.

The course is a visual symphony of water features, mature pine forests, and meticulously manicured fairways that challenge golfers of all abilities. Each hole has been thoughtfully crafted to present strategic options while rewarding accurate shot-making. The signature holes along the water offer moments of pure drama.

As a private club, Royal Mougins maintains an atmosphere of refined exclusivity, welcoming members, hotel guests, and their invited companions. The prestigious 5-star hotel on-site provides luxury accommodations, while the world-class spa offers the perfect post-round recovery.

The practice facilities are among the finest in the region, and the PGA-qualified teaching staff can help refine any aspect of your game. The elegant clubhouse serves exceptional cuisine featuring local Provençal ingredients, making every visit a complete luxury experience.`,

        description_fr: `Le Royal Mougins Golf Club se distingue comme l'une des destinations de golf les plus exclusives de la Côte d'Azur, régulièrement classé parmi les 1000 meilleurs parcours mondiaux par le Guide Rolex et dans le Top 100 d'Europe continentale par Golf World magazine. Conçu par l'architecte renommé Robert von Hagge, ce chef-d'œuvre est niché au cœur de la végétation méditerranéenne, où les rivières serpentent entre les collines vallonnées.

Le parcours est une symphonie visuelle d'obstacles d'eau, de forêts de pins matures et de fairways méticuleusement entretenus qui défient les golfeurs de tous niveaux. Chaque trou a été soigneusement conçu pour présenter des options stratégiques tout en récompensant la précision. Les trous signatures le long de l'eau offrent des moments de pur suspense.

En tant que club privé, Royal Mougins maintient une atmosphère d'exclusivité raffinée, accueillant les membres, les clients de l'hôtel et leurs invités. Le prestigieux hôtel 5 étoiles sur place propose des hébergements de luxe, tandis que le spa de classe mondiale offre une récupération parfaite après le parcours.

Les installations d'entraînement comptent parmi les meilleures de la région, et le personnel d'enseignement qualifié PGA peut aider à perfectionner tous les aspects de votre jeu. L'élégant clubhouse sert une cuisine exceptionnelle mettant en valeur les ingrédients provençaux locaux, faisant de chaque visite une expérience de luxe complète.`
    },
    {
        slug: 'cannes-mougins-golf-country-club',
        description_en: `Steeped in European Tour history, Golf Country Club Cannes-Mougins has been a cornerstone of French Riviera golf since its establishment in 1923. Set within the beautiful Parc de Valmasque Forest, this storied course hosted the prestigious Cannes Open for 14 consecutive years, witnessing victories by legends including Greg Norman, Ian Woosnam, and the incomparable Seve Ballesteros.

Designed by the celebrated duo of Dave Thomas and Peter Allis, the championship layout stretches to 6,169 meters through ancient cork oaks and Mediterranean pines. The course demands thoughtful strategy, with well-protected greens and cleverly positioned bunkers that have tested the world's best players.

Walking these fairways, you follow in the footsteps of golfing giants. The course has been lovingly maintained to championship standards, with conditions that rival any top European venue. The variety of holes ensures an engaging round, from challenging par-3s demanding precise iron play to risk-reward par-5s where eagles are possible.

The clubhouse exudes classic French elegance, offering exceptional dining and a warm, welcoming atmosphere. The professional staff provides attentive service, and the extensive practice facilities allow thorough pre-round preparation. For golfers seeking to experience living history on the Côte d'Azur, Cannes-Mougins is essential.`,

        description_fr: `Riche d'une histoire du Tour Européen, le Golf Country Club Cannes-Mougins est un pilier du golf de la Côte d'Azur depuis sa création en 1923. Situé dans le magnifique Parc de la Valmasque, ce parcours historique a accueilli le prestigieux Open de Cannes pendant 14 années consécutives, témoin des victoires de légendes comme Greg Norman, Ian Woosnam et l'incomparable Seve Ballesteros.

Conçu par le célèbre duo Dave Thomas et Peter Allis, le tracé de championnat s'étend sur 6 169 mètres à travers des chênes-lièges centenaires et des pins méditerranéens. Le parcours exige une stratégie réfléchie, avec des greens bien protégés et des bunkers intelligemment positionnés qui ont mis à l'épreuve les meilleurs joueurs du monde.

En parcourant ces fairways, vous suivez les traces des géants du golf. Le parcours a été amoureusement entretenu aux standards de championnat, avec des conditions qui rivalisent avec n'importe quel grand site européen. La variété des trous garantit un parcours captivant, des par-3 exigeants demandant un jeu de fer précis aux par-5 risque-récompense où les eagles sont possibles.

Le clubhouse respire l'élégance française classique, offrant une restauration exceptionnelle et une atmosphère chaleureuse et accueillante. Le personnel professionnel assure un service attentionné, et les vastes installations d'entraînement permettent une préparation approfondie avant le parcours.`
    },
    {
        slug: 'terre-blanche-chateau',
        description_en: `Terre Blanche Château Course represents the pinnacle of resort golf in Southern France. This GEO-certified eco-responsible championship layout, designed by the masterful Dave Thomas, stretches across 6,616 meters of pristine Provençal countryside and regularly hosts the French Riviera Masters on the Senior European Tour.

Every element of this course has been designed to the highest standards. The conditioning is immaculate throughout the season, with greens that roll true and fairways that provide perfect lies. Strategic water hazards, thoughtfully contoured bunkers, and elevated greens create a constant challenge that rewards intelligent course management.

The Château Course is the crown jewel of the Terre Blanche resort, a 5-star destination featuring luxury accommodations, a world-renowned spa, and the acclaimed Albatros Golf Performance Centre. The practice facilities are nothing short of spectacular, with extensive driving ranges, short game areas, and putting greens that mirror on-course conditions.

Following your round, the elegant clubhouse offers refined dining with panoramic views over the course. The resort's commitment to environmental sustainability adds another dimension to the experience, knowing you're playing on a course that respects and preserves its natural setting.`,

        description_fr: `Le Château Course de Terre Blanche représente l'apogée du golf de resort dans le Sud de la France. Ce tracé de championnat éco-responsable certifié GEO, conçu par le maître Dave Thomas, s'étend sur 6 616 mètres de campagne provençale immaculée et accueille régulièrement le French Riviera Masters du Senior European Tour.

Chaque élément de ce parcours a été conçu selon les plus hauts standards. L'entretien est impeccable tout au long de la saison, avec des greens qui roulent juste et des fairways offrant des lies parfaits. Les obstacles d'eau stratégiques, les bunkers soigneusement profilés et les greens surélevés créent un défi constant qui récompense une gestion intelligente du parcours.

Le Château Course est le joyau de la couronne du resort Terre Blanche, une destination 5 étoiles proposant des hébergements de luxe, un spa de renommée mondiale et le célèbre Albatros Golf Performance Centre. Les installations d'entraînement sont tout simplement spectaculaires, avec de vastes practice, des zones de petit jeu et des putting greens qui reproduisent les conditions du parcours.

Après votre parcours, l'élégant clubhouse propose une restauration raffinée avec des vues panoramiques sur le parcours. L'engagement du resort envers la durabilité environnementale ajoute une dimension supplémentaire à l'expérience.`
    },
    {
        slug: 'terre-blanche-le-riou',
        description_en: `Le Riou, the second 18-hole championship course at Terre Blanche, offers a distinctly different challenge from its famous sibling. Named after the river that winds through the property, this course features dramatic elevation changes and steep fairways that demand precise shot-making and careful club selection.

The layout weaves through pristine natural terrain, with holes carved between mature Mediterranean vegetation. The course presents a more intimate feel than the Château Course, with narrower fairways and more demanding tee shots. Water comes into play on several holes, and the contoured greens require careful reading.

Reserved exclusively for club members, their guests, and hotel guests, Le Riou maintains a tranquil atmosphere perfect for focused practice or relaxed social rounds. The morning mist rolling off the river creates magical playing conditions, while afternoon rounds benefit from warm Provençal sunshine.

As part of the Terre Blanche resort, players enjoy access to all the luxury amenities, including the 5-star accommodations, award-winning spa, and exceptional dining options. The combination of two world-class courses makes Terre Blanche the ultimate golf destination for those seeking an extended French Riviera golf experience.`,

        description_fr: `Le Riou, le second parcours de championnat 18 trous de Terre Blanche, offre un défi nettement différent de celui de son célèbre jumeau. Nommé d'après la rivière qui serpente à travers la propriété, ce parcours présente des changements d'altitude spectaculaires et des fairways pentus qui exigent un jeu précis et une sélection de club minutieuse.

Le tracé se faufile à travers un terrain naturel préservé, avec des trous creusés entre la végétation méditerranéenne mature. Le parcours offre une atmosphère plus intime que le Château Course, avec des fairways plus étroits et des coups de départ plus exigeants. L'eau entre en jeu sur plusieurs trous, et les greens profilés nécessitent une lecture attentive.

Réservé exclusivement aux membres du club, à leurs invités et aux clients de l'hôtel, Le Riou maintient une atmosphère tranquille parfaite pour un entraînement concentré ou des parcours sociaux détendus. La brume matinale s'élevant de la rivière crée des conditions de jeu magiques, tandis que les parcours de l'après-midi bénéficient du chaud soleil provençal.

En tant que partie du resort Terre Blanche, les joueurs profitent de l'accès à toutes les commodités de luxe, y compris les hébergements 5 étoiles, le spa primé et les options de restauration exceptionnelles.`
    },
    {
        slug: 'old-course-mandelieu',
        description_en: `The Old Course Golf Club Mandelieu holds a special place in French golf history as one of the oldest courses in the nation, created in 1891 by the Grand Duke Michel of Russia. This legendary layout has witnessed over 130 years of golfing tradition, making every round a journey through time on the French Riviera.

Stretching along the Siagne River delta near the Mediterranean coast, the course offers a flat, links-inspired layout that differs from the hillier courses typical of the region. The strategic design rewards thoughtful play, with mature trees framing fairways and water hazards demanding respect on multiple holes.

Despite its relatively modest length of 5,676 meters, the Old Course provides a stern test through its tight fairways and well-defended greens. The condition of the turf is consistently excellent, and the historical character of the course adds immeasurable charm to the experience.

The clubhouse, a historic building in its own right, offers comfortable facilities and excellent dining overlooking the course. The welcoming atmosphere and accessible layout make this course suitable for golfers of all abilities while still challenging low handicappers. For anyone seeking to experience the birthplace of Riviera golf, the Old Course Mandelieu is absolutely essential.`,

        description_fr: `L'Old Course Golf Club Mandelieu occupe une place spéciale dans l'histoire du golf français en tant que l'un des parcours les plus anciens du pays, créé en 1891 par le Grand-Duc Michel de Russie. Ce tracé légendaire a été témoin de plus de 130 ans de tradition golfique, faisant de chaque parcours un voyage dans le temps sur la Côte d'Azur.

S'étendant le long du delta de la Siagne près de la côte méditerranéenne, le parcours offre un tracé plat inspiré des links qui diffère des parcours plus vallonnés typiques de la région. La conception stratégique récompense le jeu réfléchi, avec des arbres matures encadrant les fairways et des obstacles d'eau exigeant le respect sur plusieurs trous.

Malgré sa longueur relativement modeste de 5 676 mètres, l'Old Course offre un test sérieux grâce à ses fairways serrés et ses greens bien défendus. L'état du gazon est constamment excellent, et le caractère historique du parcours ajoute un charme inestimable à l'expérience.

Le clubhouse, un bâtiment historique à part entière, offre des installations confortables et une excellente restauration avec vue sur le parcours. L'atmosphère accueillante et le tracé accessible rendent ce parcours adapté aux golfeurs de tous niveaux tout en défiant les joueurs à faible handicap.`
    },
    {
        slug: 'riviera-golf-barbossi',
        description_en: `Riviera Golf de Barbossi offers a truly unique experience on the French Riviera, combining championship golf with contemporary art in a stunning natural setting. Designed by the legendary Robert Trent Jones Sr., this course is perched on the heights above Cannes Bay, providing spectacular views of the red Estérel mountains and the estate's own vineyards.

What sets Barbossi apart is its remarkable sculpture collection. As you play the 18 holes, you encounter significant works of contemporary art strategically placed throughout the course. This fusion of golf and culture creates an experience unlike any other on the Côte d'Azur.

The course itself is a classic Trent Jones design, featuring strategic bunkering, undulating greens, and holes that offer multiple paths to the pin depending on your skill and risk tolerance. At 5,736 meters, it provides a fair but engaging test that rewards precise iron play and careful course management.

The elevated position offers cooling breezes and dramatic light throughout the day, while the Mediterranean vegetation including umbrella pines and cork oaks frames each hole beautifully. The clubhouse restaurant serves excellent local cuisine with vineyard views, completing an experience that engages all the senses.`,

        description_fr: `Le Riviera Golf de Barbossi offre une expérience véritablement unique sur la Côte d'Azur, combinant golf de championnat et art contemporain dans un cadre naturel époustouflant. Conçu par le légendaire Robert Trent Jones Sr., ce parcours est perché sur les hauteurs dominant la baie de Cannes, offrant des vues spectaculaires sur les montagnes rouges de l'Estérel et les vignobles du domaine.

Ce qui distingue Barbossi est sa remarquable collection de sculptures. En jouant les 18 trous, vous rencontrez des œuvres significatives d'art contemporain stratégiquement placées sur tout le parcours. Cette fusion du golf et de la culture crée une expérience unique sur la Côte d'Azur.

Le parcours lui-même est un design classique de Trent Jones, présentant des bunkers stratégiques, des greens ondulés et des trous offrant plusieurs chemins vers le drapeau selon votre niveau et votre tolérance au risque. À 5 736 mètres, il offre un test équitable mais engageant qui récompense un jeu de fer précis et une gestion attentive du parcours.

La position élevée offre des brises rafraîchissantes et une lumière dramatique tout au long de la journée, tandis que la végétation méditerranéenne incluant pins parasols et chênes-lièges encadre magnifiquement chaque trou.`
    },
    {
        slug: 'golf-opio-valbonne',
        description_en: `Golf Opio Valbonne is rightfully considered one of the jewels of the French Riviera, offering 18 spectacular holes through a magnificent 220-hectare natural estate ideally situated between Cannes, Nice, and the perfume capital of Grasse. This course delivers an unforgettable experience combining natural beauty with thoughtful design.

The layout traverses wonderfully varied terrain, from peaceful valleys to dramatic hillside holes that offer sweeping views of the Provençal landscape. Rich Mediterranean vegetation including ancient olive groves, cork oaks, and aromatic herbs surrounds every hole, creating a sensory experience that goes far beyond the golf itself.

The course presents an enjoyable challenge for players of all abilities. Strategic water features come into play on several holes, while the contoured greens demand careful reading. The variety of hole lengths and configurations ensures that every club in your bag sees action.

Excellent practice facilities allow thorough warm-up before your round, and the on-site golf academy offers professional instruction for those looking to improve. The charming clubhouse serves classic French cuisine with terrace views over the course, making the 19th hole as memorable as the preceding eighteen.`,

        description_fr: `Le Golf Opio Valbonne est considéré à juste titre comme l'un des joyaux de la Côte d'Azur, offrant 18 trous spectaculaires à travers un magnifique domaine naturel de 220 hectares idéalement situé entre Cannes, Nice et la capitale du parfum, Grasse. Ce parcours offre une expérience inoubliable combinant beauté naturelle et conception réfléchie.

Le tracé traverse un terrain merveilleusement varié, des vallées paisibles aux trous spectaculaires à flanc de colline offrant des vues panoramiques sur le paysage provençal. Une riche végétation méditerranéenne comprenant d'anciennes oliveraies, des chênes-lièges et des herbes aromatiques entoure chaque trou, créant une expérience sensorielle qui va bien au-delà du golf lui-même.

Le parcours présente un défi agréable pour les joueurs de tous niveaux. Des obstacles d'eau stratégiques entrent en jeu sur plusieurs trous, tandis que les greens profilés exigent une lecture attentive. La variété des longueurs et configurations de trous garantit que chaque club de votre sac sera sollicité.

D'excellentes installations d'entraînement permettent un échauffement complet avant votre parcours, et l'académie de golf sur place propose un enseignement professionnel pour ceux qui cherchent à progresser.`
    },
    {
        slug: 'grande-bastide',
        description_en: `Golf de la Grande Bastide has earned its reputation as one of the most popular courses on the French Riviera, set within a magnificent wooded and hilly environment in the charming commune of Châteauneuf-Grasse. The course's seven water features add both beauty and strategic challenge to an already engaging layout.

The design welcomes golfers of all abilities, from those just beginning their golfing journey to experienced players seeking a pleasant yet testing round. The generous fairways on most holes provide forgiveness from the tee, while the approach shots to well-protected greens demand more precision.

Natural beauty abounds throughout the course, with mature Mediterranean pines providing shade and framing each hole. The rolling terrain creates interesting lies and elevation changes that keep every round fresh and engaging. Wildlife frequently makes appearances, adding to the sense of playing within an unspoiled natural environment.

The excellent practice facilities include a well-maintained driving range and putting greens, while the professional teaching staff can help players of any level improve their game. The welcoming clubhouse offers comfortable post-round relaxation with quality dining options. For accessible yet enjoyable golf near Grasse, Grande Bastide delivers consistently.`,

        description_fr: `Le Golf de la Grande Bastide a gagné sa réputation comme l'un des parcours les plus populaires de la Côte d'Azur, situé dans un magnifique environnement boisé et vallonné dans la charmante commune de Châteauneuf-Grasse. Les sept plans d'eau du parcours ajoutent à la fois beauté et défi stratégique à un tracé déjà captivant.

La conception accueille les golfeurs de tous niveaux, de ceux qui commencent leur aventure golfique aux joueurs expérimentés recherchant un parcours agréable mais exigeant. Les fairways généreux sur la plupart des trous offrent du pardon depuis le départ, tandis que les approches vers des greens bien protégés demandent plus de précision.

La beauté naturelle abonde sur tout le parcours, avec des pins méditerranéens matures fournissant de l'ombre et encadrant chaque trou. Le terrain vallonné crée des lies intéressants et des changements d'altitude qui maintiennent chaque parcours frais et engageant. La faune fait fréquemment son apparition, ajoutant au sentiment de jouer dans un environnement naturel préservé.

Les excellentes installations d'entraînement comprennent un practice bien entretenu et des putting greens, tandis que le personnel enseignant professionnel peut aider les joueurs de tout niveau à améliorer leur jeu.`
    },
    {
        slug: 'golf-club-biot',
        description_en: `Golf Club de Biot carries nearly a century of history, originally established in 1930 as Golf de la Bastide du Roy at the foot of the picturesque village of Biot, famous worldwide as the city of glassmakers. This character-rich course offers an atypical layout that rewards creativity and course management over raw power.

The design by James Peter Gannon and Percy Boomer reflects the strategic thinking of early 20th-century golf architecture. Tight fairways wind through mature vegetation, demanding accuracy from the tee. The greens, while not enormous, are full of subtle breaks that challenge even experienced putters.

What the course lacks in length it compensates with character and charm. Many holes require you to shape shots, working the ball around natural obstacles and mature trees that have witnessed decades of play. This is a thinking golfer's course where strategy trumps strength.

The village of Biot itself is worth exploring before or after your round, with its famous glass-blowing workshops and charming medieval streets. The clubhouse maintains a friendly, unpretentious atmosphere where local members and visitors mix easily. For those seeking authentic French Riviera golf away from the more commercialized venues, Biot provides a genuinely memorable experience.`,

        description_fr: `Le Golf Club de Biot porte près d'un siècle d'histoire, fondé originellement en 1930 sous le nom de Golf de la Bastide du Roy au pied du pittoresque village de Biot, mondialement connu comme la cité des verriers. Ce parcours au caractère riche offre un tracé atypique qui récompense la créativité et la gestion du parcours plutôt que la puissance brute.

La conception de James Peter Gannon et Percy Boomer reflète la pensée stratégique de l'architecture de golf du début du 20e siècle. Des fairways étroits serpentent à travers une végétation mature, exigeant de la précision depuis le départ. Les greens, bien que pas énormes, sont pleins de breaks subtils qui défient même les putteurs expérimentés.

Ce que le parcours manque en longueur, il le compense par le caractère et le charme. De nombreux trous exigent que vous façonniez vos coups, travaillant la balle autour d'obstacles naturels et d'arbres matures qui ont été témoins de décennies de jeu. C'est un parcours pour golfeurs réfléchis où la stratégie prime sur la force.

Le village de Biot lui-même vaut la peine d'être exploré avant ou après votre parcours, avec ses célèbres ateliers de soufflage de verre et ses charmantes rues médiévales. Le clubhouse maintient une atmosphère amicale et sans prétention.`
    },
    {
        slug: 'golf-saint-donat',
        description_en: `Golf de Saint Donat stands as a testament to the artistry of Robert Trent Jones Jr., who crafted this magnificent layout through terrain steeped in history. The course follows the path of an ancient Roman road, weaving between century-old olive trees and majestic oaks that witnessed centuries of Provençal life before the first golf ball was ever struck here.

Gary Player himself inaugurated this course, lending his legendary name to what remains one of the most respected layouts in the region. At 6,031 meters from the championship tees, Saint Donat presents a serious challenge that rewards both power and precision. Strategic water features guard several holes, while the famous Trent Jones bunkering demands respect throughout.

The doglegs that characterize many holes require careful course management and the ability to shape shots in both directions. The greens are typically large but full of movement, creating three-putt opportunities for those who find the wrong tier. This is championship golf in every sense.

The setting in the hills above Grasse, the world's perfume capital, adds another dimension to the experience. Aromatic vegetation scents the air as you play, while views extend across the Provençal countryside. The well-appointed clubhouse and excellent practice facilities complete a venue worthy of any serious golfer's attention.`,

        description_fr: `Le Golf de Saint Donat témoigne de l'art de Robert Trent Jones Jr., qui a conçu ce magnifique tracé à travers un terrain chargé d'histoire. Le parcours suit le chemin d'une ancienne voie romaine, serpentant entre des oliviers centenaires et des chênes majestueux qui ont été témoins de siècles de vie provençale avant que la première balle de golf n'y soit jamais frappée.

Gary Player lui-même a inauguré ce parcours, prêtant son nom légendaire à ce qui reste l'un des tracés les plus respectés de la région. À 6 031 mètres depuis les départs de championnat, Saint Donat présente un défi sérieux qui récompense à la fois la puissance et la précision. Des obstacles d'eau stratégiques gardent plusieurs trous, tandis que les célèbres bunkers Trent Jones exigent le respect tout au long du parcours.

Les doglegs qui caractérisent de nombreux trous nécessitent une gestion attentive du parcours et la capacité de façonner les coups dans les deux directions. Les greens sont généralement grands mais pleins de mouvement, créant des opportunités de trois putts pour ceux qui trouvent le mauvais niveau.

Le cadre dans les collines au-dessus de Grasse, capitale mondiale du parfum, ajoute une autre dimension à l'expérience. La végétation aromatique parfume l'air pendant que vous jouez, tandis que les vues s'étendent sur la campagne provençale.`
    },
    {
        slug: 'golf-roquebrune',
        description_en: `Positioned perfectly between Cannes and Saint-Tropez, Golf de Roquebrune offers a technical 18-hole challenge with spectacular views of the ancient Maures mountain range. This demanding course has become a favored venue for competitions, testing players with its strategic layout and impeccable conditioning.

The course design requires thoughtful play from the first tee to the final green. Elevation changes create interesting approach angles, while the strategically placed hazards punish errant shots without being unfair. The greens are typically fast and true, rewarding those who take time to read their putts carefully.

Beyond the golf, Roquebrune offers a complete luxury experience. The on-site 5-star hotel provides refined accommodations, while the spa offers the perfect remedy for tired muscles after a challenging round. The gourmet restaurant serves exceptional cuisine that draws diners from across the region.

The setting is quintessentially Provençal, with cork oaks, parasol pines, and colorful Mediterranean vegetation framing each hole. The views toward the Rocher de Roquebrune, the distinctive rocky outcrop that gives the area its name, provide a dramatic backdrop throughout your round. For golfers seeking a premium experience in the heart of the Var, Roquebrune delivers on every level.`,

        description_fr: `Parfaitement positionné entre Cannes et Saint-Tropez, le Golf de Roquebrune offre un défi technique de 18 trous avec des vues spectaculaires sur l'ancienne chaîne des Maures. Ce parcours exigeant est devenu un lieu privilégié pour les compétitions, testant les joueurs avec son tracé stratégique et son entretien impeccable.

La conception du parcours exige un jeu réfléchi du premier départ au dernier green. Les changements d'altitude créent des angles d'approche intéressants, tandis que les obstacles stratégiquement placés punissent les coups errants sans être injustes. Les greens sont généralement rapides et justes, récompensant ceux qui prennent le temps de lire attentivement leurs putts.

Au-delà du golf, Roquebrune offre une expérience de luxe complète. L'hôtel 5 étoiles sur place propose des hébergements raffinés, tandis que le spa offre le remède parfait pour les muscles fatigués après un parcours exigeant. Le restaurant gastronomique sert une cuisine exceptionnelle qui attire des convives de toute la région.

Le cadre est typiquement provençal, avec des chênes-lièges, des pins parasols et une végétation méditerranéenne colorée encadrant chaque trou. Les vues vers le Rocher de Roquebrune offrent une toile de fond dramatique tout au long de votre parcours.`
    },
    {
        slug: 'golf-saint-endreol',
        description_en: `Golf de Saint Endréol has earned its place among the elite courses of France, rated 14th in the Top 50 French courses by Golf Européen magazine. Designed by Michel Gayon and opened in 1992, this picturesque layout unfolds against a stunning backdrop of parasol pines, the gentle River Endre, and the imposing Rocher de Roquebrune rising dramatically in the distance.

The course at 5,883 meters provides a fair but challenging test that rewards strategic thinking and precise execution. Water comes into play on several holes, creating both hazards and memorable visual moments. The greens are well-protected and typically firm, demanding accurate approach shots and a deft putting touch.

As part of a 4-star resort, Saint Endréol offers more than exceptional golf. Comfortable accommodations allow you to extend your stay and play multiple rounds, while the resort's restaurants provide excellent dining options featuring regional Provençal cuisine.

The practice facilities are extensive, allowing thorough preparation before tackling the course. The professional staff offers instruction for players looking to improve, and the well-stocked pro shop ensures you have everything needed for your round. For those seeking top-tier golf in a serene Var setting, Saint Endréol consistently delivers an outstanding experience.`,

        description_fr: `Le Golf de Saint Endréol a gagné sa place parmi les parcours d'élite de France, classé 14e dans le Top 50 des parcours français par Golf Européen magazine. Conçu par Michel Gayon et ouvert en 1992, ce tracé pittoresque se déploie contre une toile de fond époustouflante de pins parasols, de la douce rivière Endre et de l'imposant Rocher de Roquebrune s'élevant dramatiquement au loin.

Le parcours de 5 883 mètres offre un test équitable mais exigeant qui récompense la réflexion stratégique et l'exécution précise. L'eau entre en jeu sur plusieurs trous, créant à la fois des obstacles et des moments visuels mémorables. Les greens sont bien protégés et généralement fermes, exigeant des coups d'approche précis et un toucher de putting délicat.

En tant que partie d'un resort 4 étoiles, Saint Endréol offre plus qu'un golf exceptionnel. Des hébergements confortables vous permettent de prolonger votre séjour et de jouer plusieurs parcours, tandis que les restaurants du resort proposent d'excellentes options de restauration mettant en valeur la cuisine provençale régionale.

Les installations d'entraînement sont étendues, permettant une préparation approfondie avant d'affronter le parcours. Le personnel professionnel propose des cours pour les joueurs cherchant à progresser.`
    },
    {
        slug: 'golf-valescure',
        description_en: `Golf de Valescure holds the distinction of being one of the oldest courses on the Côte d'Azur, with over a century of history welcoming golfers to its uniquely British-inspired layout. Designed by Lord Ashcomb, this charming course retains all the character and strategic challenge of early golf architecture while maintaining excellent modern conditioning.

At just 5,061 meters with a par of 68, Valescure might seem short by modern standards, but length is far from the only measure of difficulty here. The course is famous for its tiny "postage stamp" greens that demand pinpoint accuracy on approach shots. Finding the putting surface is only half the battle—holding it requires skill and careful club selection.

The British heritage shows in the strategic bunkering and the premium placed on shot-making over power. This is a course where a smooth 7-iron to a tight pin position matters more than a booming drive. Low-handicap players particularly appreciate the precision demands.

Located in the Saint-Raphaël area, Valescure pairs beautifully with neighboring Estérel Latitudes Golf for a two-course day exploring different eras of golf architecture. The historic clubhouse provides comfortable post-round facilities with traditional charm. For golfers who appreciate classical design and don't equate difficulty with distance, Valescure offers a genuinely rewarding experience.`,

        description_fr: `Le Golf de Valescure détient la distinction d'être l'un des parcours les plus anciens de la Côte d'Azur, avec plus d'un siècle d'histoire accueillant les golfeurs sur son tracé d'inspiration britannique unique. Conçu par Lord Ashcomb, ce parcours charmant conserve tout le caractère et le défi stratégique de l'architecture de golf d'époque tout en maintenant un excellent entretien moderne.

À seulement 5 061 mètres avec un par de 68, Valescure peut sembler court selon les standards modernes, mais la longueur est loin d'être la seule mesure de difficulté ici. Le parcours est célèbre pour ses minuscules greens "timbre-poste" qui exigent une précision chirurgicale sur les coups d'approche. Trouver la surface de putting n'est que la moitié de la bataille—la tenir nécessite habileté et sélection de club minutieuse.

L'héritage britannique se manifeste dans les bunkers stratégiques et l'importance accordée à la fabrication des coups plutôt qu'à la puissance. C'est un parcours où un fer 7 en douceur vers un drapeau serré compte plus qu'un drive surpuissant.

Situé dans la région de Saint-Raphaël, Valescure se marie parfaitement avec le voisin Estérel Latitudes Golf pour une journée à deux parcours explorant différentes époques de l'architecture de golf.`
    },
    {
        slug: 'chateau-de-taulane',
        description_en: `Château de Taulane represents one of golf's most spectacular hidden gems, a Gary Player-designed masterpiece perched at 1,000 meters altitude in the heart of the magnificent Gorges du Verdon. Far from the coastal bustle of the Riviera, this course offers absolute tranquility combined with breathtaking mountain scenery that ranks among the most dramatic in European golf.

Gary Player's design takes full advantage of the extraordinary natural setting, with holes that frame stunning views of the surrounding peaks and valleys. At 6,300 meters, the course provides a serious championship test, though the mountain air means balls travel farther than at sea level. Strategic bunkering and carefully shaped greens create challenge without unfairness.

The conditioning at Taulane is exceptional—immaculate fairways and greens that would be the envy of many more accessible venues. The isolation of the location means this course never feels crowded, offering a peaceful playing experience that allows full appreciation of the surroundings.

The château itself provides elegant accommodation for those wishing to extend their stay, and the restaurant serves refined cuisine with local influences. The journey to reach Taulane takes you through some of the most spectacular scenery in Provence, making the trip itself part of the experience. This is truly a bucket-list course for any serious golfer visiting the South of France.`,

        description_fr: `Le Château de Taulane représente l'un des joyaux cachés les plus spectaculaires du golf, un chef-d'œuvre conçu par Gary Player perché à 1 000 mètres d'altitude au cœur des magnifiques Gorges du Verdon. Loin de l'agitation côtière de la Riviera, ce parcours offre une tranquillité absolue combinée à des paysages de montagne époustouflants qui comptent parmi les plus dramatiques du golf européen.

La conception de Gary Player tire pleinement parti du cadre naturel extraordinaire, avec des trous qui encadrent des vues imprenables sur les sommets et vallées environnants. À 6 300 mètres, le parcours offre un sérieux test de championnat, bien que l'air de montagne signifie que les balles voyagent plus loin qu'au niveau de la mer.

L'entretien à Taulane est exceptionnel—des fairways impeccables et des greens qui feraient l'envie de nombreux sites plus accessibles. L'isolement du lieu signifie que ce parcours ne semble jamais bondé, offrant une expérience de jeu paisible qui permet une pleine appréciation du cadre.

Le château lui-même propose un hébergement élégant pour ceux souhaitant prolonger leur séjour, et le restaurant sert une cuisine raffinée aux influences locales. C'est véritablement un parcours à faire absolument pour tout golfeur sérieux visitant le Sud de la France.`
    },
    {
        slug: 'golf-saint-tropez',
        description_en: `Golf de Saint-Tropez brings the legendary Gary Player's design vision to one of the world's most glamorous destinations. Set within a protected landscape with breathtaking views of Gassin, Grimaud, Ramatuelle, and the iconic Saint-Tropez peninsula, this course combines championship golf with the unmistakable Riviera lifestyle.

Player's design works harmoniously with the natural terrain, creating holes that feel both challenging and organic to the landscape. The course rewards strategic play and penalizes wayward shots, demanding respect from the tee to the green. Views of the Mediterranean and surrounding hilltop villages accompany you throughout your round.

The massive 1,600-square-meter Provençal clubhouse sets the tone for the experience, offering refined dining, comfortable lounging areas, and all the amenities expected of a Saint-Tropez address. The atmosphere blends sporty elegance with the relaxed sophistication that defines this legendary coastal town.

Practice facilities are comprehensive, and the professional staff can arrange everything from individual instruction to corporate events. The course's location means you're perfectly positioned to explore Saint-Tropez's famous beaches, restaurants, and nightlife after your round. For golfers who appreciate combining world-class golf with the glamour of the Riviera's most famous resort town, this course delivers on every level.`,

        description_fr: `Le Golf de Saint-Tropez apporte la vision de conception du légendaire Gary Player à l'une des destinations les plus glamour du monde. Situé dans un paysage protégé avec des vues époustouflantes sur Gassin, Grimaud, Ramatuelle et l'emblématique péninsule de Saint-Tropez, ce parcours combine golf de championnat et style de vie inimitable de la Riviera.

La conception de Player s'harmonise avec le terrain naturel, créant des trous qui semblent à la fois exigeants et organiques au paysage. Le parcours récompense le jeu stratégique et pénalise les coups égarés, exigeant le respect du départ au green. Les vues sur la Méditerranée et les villages perchés environnants vous accompagnent tout au long de votre parcours.

Le massif clubhouse provençal de 1 600 mètres carrés donne le ton de l'expérience, offrant une restauration raffinée, des espaces de détente confortables et toutes les commodités attendues d'une adresse tropézienne. L'atmosphère mêle élégance sportive et sophistication décontractée qui définit cette légendaire ville côtière.

Les installations d'entraînement sont complètes, et le personnel professionnel peut organiser tout, de l'instruction individuelle aux événements d'entreprise. L'emplacement du parcours signifie que vous êtes parfaitement positionné pour explorer les célèbres plages, restaurants et vie nocturne de Saint-Tropez après votre parcours.`
    },
    {
        slug: 'nice-golf-country-club',
        description_en: `Nice Golf Country Club provides the perfect solution for golfers seeking a quality round without sacrificing valuable beach or sightseeing time. Located just 10 minutes from the Nice seafront, this accessible 9-hole course offers genuine golfing enjoyment in a compact format ideal for beginners, casual players, or anyone short on time.

The par-32 layout provides opportunities to work on every aspect of your short game while still offering enough variety to engage experienced players looking for a quick round. The convenient location means you can squeeze in nine holes before or after exploring Nice's legendary attractions along the Promenade des Anglais.

Despite its modest size, the course is well-maintained and offers pleasant playing conditions throughout the year. The Mediterranean climate ensures excellent weather for most seasons, and the course's relatively flat terrain makes for comfortable walking even on warmer days.

The facilities include a practice putting green and a welcoming pro shop stocked with essentials. The atmosphere is relaxed and friendly, making this an ideal venue for beginners who might feel intimidated at larger, more formal clubs. For visitors to Nice wanting to combine city exploration with a bit of golf, this course offers the perfect balance of convenience and quality.`,

        description_fr: `Le Nice Golf Country Club offre la solution parfaite pour les golfeurs recherchant un parcours de qualité sans sacrifier un temps précieux de plage ou de tourisme. Situé à seulement 10 minutes du front de mer de Nice, ce parcours accessible de 9 trous offre un véritable plaisir golfique dans un format compact idéal pour les débutants, les joueurs occasionnels ou toute personne pressée par le temps.

Le tracé par 32 offre des opportunités de travailler tous les aspects de votre petit jeu tout en proposant assez de variété pour engager les joueurs expérimentés recherchant un parcours rapide. L'emplacement pratique signifie que vous pouvez caser neuf trous avant ou après avoir exploré les attractions légendaires de Nice le long de la Promenade des Anglais.

Malgré sa taille modeste, le parcours est bien entretenu et offre des conditions de jeu agréables tout au long de l'année. Le climat méditerranéen assure un excellent temps pour la plupart des saisons, et le terrain relativement plat du parcours permet une marche confortable même les jours plus chauds.

Les installations comprennent un practice de putting et un pro shop accueillant bien approvisionné en essentiels. L'atmosphère est détendue et amicale, faisant de cet endroit un lieu idéal pour les débutants qui pourraient se sentir intimidés dans des clubs plus grands et plus formels.`
    },
    {
        slug: 'golf-claux-amic',
        description_en: `Golf Claux-Amic offers an enjoyable 18-hole experience in the heart of the Grasse hinterland, positioned perfectly for golfers planning a multi-course exploration of this golf-rich area. With four other courses within easy reach, Claux-Amic serves as an ideal component of an extended French Riviera golf trip.

The course provides a pleasant challenge across its 18 holes, winding through typical Mediterranean landscape of pines and olive trees. The layout suits golfers of varying abilities, offering enough challenge to engage experienced players while remaining accessible to those still developing their games.

The location in the hills above the perfume capital of Grasse means playing in cooler temperatures during summer months, a welcome relief from coastal heat. Views extend across the Provençal countryside, and the tranquil atmosphere allows for relaxed, unhurried rounds.

Facilities include a driving range and putting greens for pre-round warm-up, while the clubhouse provides comfortable post-round relaxation with views over the course. The friendly atmosphere and reasonable green fees make this a popular choice among local players and visitors alike. For those seeking quality golf without the premium prices of the region's most exclusive venues, Claux-Amic delivers excellent value.`,

        description_fr: `Le Golf Claux-Amic offre une expérience agréable de 18 trous au cœur de l'arrière-pays grassois, parfaitement positionné pour les golfeurs planifiant une exploration multi-parcours de cette région riche en golf. Avec quatre autres parcours facilement accessibles, Claux-Amic constitue un élément idéal d'un voyage de golf prolongé sur la Côte d'Azur.

Le parcours présente un défi plaisant sur ses 18 trous, serpentant à travers un paysage méditerranéen typique de pins et d'oliviers. Le tracé convient aux golfeurs de différents niveaux, offrant assez de challenge pour engager les joueurs expérimentés tout en restant accessible à ceux qui développent encore leur jeu.

L'emplacement dans les collines au-dessus de la capitale du parfum Grasse signifie jouer à des températures plus fraîches pendant les mois d'été, un soulagement bienvenu de la chaleur côtière. Les vues s'étendent sur la campagne provençale, et l'atmosphère tranquille permet des parcours détendus et sans hâte.

Les installations comprennent un practice et des putting greens pour l'échauffement avant le parcours, tandis que le clubhouse offre une détente confortable après le parcours avec vue sur le parcours. L'atmosphère amicale et les green fees raisonnables en font un choix populaire parmi les joueurs locaux et les visiteurs.`
    },
    {
        slug: 'golf-barbaroux',
        description_en: `Golf de Barbaroux carries the distinguished signature of Pete Dye and his son P.B. Dye, two of golf architecture's most celebrated names. This championship-level course brings American-style design excellence to the heart of the Provençal countryside, offering a challenge that has earned respect from professionals and amateurs alike.

The Dye design philosophy is evident throughout: strategic risk-reward opportunities, creative bunkering, and greens complexes that demand precision. The course rewards thinking players who can plot their way around, while punishing aggressive play that misses its target. This is golf that engages the mind as much as it tests physical skills.

Set within rolling Provençal terrain, the course benefits from natural drainage and excellent playing surfaces year-round. The Mediterranean vegetation frames each hole without creating unfair penalties for slightly errant shots. The facilities match the course quality, with extensive practice areas and a well-appointed clubhouse.

Located near Brignoles, Barbaroux offers a genuine championship experience without the exclusivity barriers of some Riviera clubs. The course welcomes visitors and provides the facilities and conditioning that serious golfers expect. For those seeking to test themselves against a true Dye design in the South of France, Barbaroux is the answer.`,

        description_fr: `Le Golf de Barbaroux porte la signature distinguée de Pete Dye et son fils P.B. Dye, deux des noms les plus célébrés de l'architecture de golf. Ce parcours de niveau championnat apporte l'excellence du design à l'américaine au cœur de la campagne provençale, offrant un défi qui a gagné le respect des professionnels et des amateurs.

La philosophie de conception Dye est évidente tout au long du parcours : opportunités stratégiques risque-récompense, bunkers créatifs et complexes de greens qui exigent la précision. Le parcours récompense les joueurs réfléchis capables de tracer leur chemin, tout en punissant le jeu agressif qui manque sa cible. C'est du golf qui engage l'esprit autant qu'il teste les compétences physiques.

Situé dans un terrain provençal vallonné, le parcours bénéficie d'un drainage naturel et d'excellentes surfaces de jeu toute l'année. La végétation méditerranéenne encadre chaque trou sans créer de pénalités injustes pour les coups légèrement errants.

Situé près de Brignoles, Barbaroux offre une véritable expérience de championnat sans les barrières d'exclusivité de certains clubs de la Riviera. Le parcours accueille les visiteurs et fournit les installations et l'entretien que les golfeurs sérieux attendent.`
    },
    {
        slug: 'esterel-latitudes-golf',
        description_en: `Estérel Latitudes Golf brings the masterful touch of Robert Trent Jones Sr. to the Saint-Raphaël area, offering a modern complement to neighboring Valescure's century-old charm. Opened in 1989, this course showcases the legendary architect's later design philosophy while providing an engaging challenge for players of all abilities.

The Trent Jones signature elements are present throughout: strategically placed bunkers, thoughtfully designed greens, and holes that offer multiple paths to the pin depending on your skill level and risk tolerance. At par 68, the course rewards precision over power, making it particularly satisfying for players who rely on course management rather than length.

The setting within the dramatic Estérel landscape adds visual drama to every round. The red rocks that characterize this coastal mountain range provide a stunning backdrop, while Mediterranean vegetation including cork oaks and umbrella pines frames each hole naturally.

Pairing Estérel Latitudes with neighboring Valescure creates a perfect day exploring contrasting eras of golf architecture—from early 20th-century British design to late 20th-century American excellence. The convenient location near Saint-Raphaël means easy access from coastal accommodations, while the well-maintained facilities ensure a quality experience throughout your visit.`,

        description_fr: `L'Estérel Latitudes Golf apporte le toucher magistral de Robert Trent Jones Sr. à la région de Saint-Raphaël, offrant un complément moderne au charme centenaire du voisin Valescure. Ouvert en 1989, ce parcours présente la philosophie de conception tardive du légendaire architecte tout en offrant un défi engageant pour les joueurs de tous niveaux.

Les éléments signature de Trent Jones sont présents partout : bunkers stratégiquement placés, greens soigneusement conçus et trous offrant plusieurs chemins vers le drapeau selon votre niveau et votre tolérance au risque. À par 68, le parcours récompense la précision plutôt que la puissance, le rendant particulièrement satisfaisant pour les joueurs qui comptent sur la gestion du parcours plutôt que la longueur.

Le cadre dans le paysage dramatique de l'Estérel ajoute un drame visuel à chaque parcours. Les rochers rouges qui caractérisent cette chaîne de montagnes côtière offrent une toile de fond époustouflante, tandis que la végétation méditerranéenne incluant chênes-lièges et pins parasols encadre naturellement chaque trou.

Associer Estérel Latitudes avec le voisin Valescure crée une journée parfaite explorant des époques contrastées de l'architecture de golf—du design britannique du début du 20e siècle à l'excellence américaine de la fin du 20e siècle.`
    }
];

const updateDescriptions = async () => {
    const client = await pool.connect();

    try {
        console.log('Updating course descriptions...\n');

        for (const course of courseDescriptions) {
            await client.query(
                `UPDATE courses
                 SET description_en = $1,
                     description_fr = $2,
                     updated_at = NOW()
                 WHERE slug = $3`,
                [course.description_en, course.description_fr, course.slug]
            );
            console.log(`  ✓ ${course.slug}`);
        }

        console.log(`\n✅ Updated ${courseDescriptions.length} course descriptions!`);

    } catch (err) {
        console.error('Error updating descriptions:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
};

updateDescriptions().catch(console.error);
