require('dotenv').config();
const db = require('../config/database');

const blogPostsFR = [
    {
        slug: 'meilleurs-parcours-golf-debutants-cote-azur',
        title: 'Les Meilleurs Parcours de Golf pour Débutants sur la Côte d\'Azur',
        excerpt: 'Découvrez les parcours de golf les plus accueillants pour les débutants sur la Côte d\'Azur. Des fairways indulgents aux excellentes installations d\'entraînement.',
        category: 'Guides',
        author: 'French Riviera Golf',
        meta_description: 'Trouvez les meilleurs parcours de golf pour débutants sur la Côte d\'Azur. Clubs accueillants, tracés indulgents et excellentes installations d\'entraînement.',
        content: `
<p>La Côte d'Azur abrite certains des parcours de golf les plus prestigieux au monde, mais ne vous laissez pas intimider si vous débutez. De nombreux parcours de la région accueillent chaleureusement les débutants et offrent d'excellentes installations pour vous aider à progresser.</p>

<h2>Qu'est-ce qui rend un parcours adapté aux débutants ?</h2>

<p>Lorsque vous recherchez un parcours adapté aux débutants, considérez ces facteurs :</p>

<ul>
<li><strong>Des fairways larges</strong> qui pardonnent les coups imprécis</li>
<li><strong>Moins d'obstacles</strong> ou des obstacles stratégiquement placés qui ne pénalisent pas trop les débutants</li>
<li><strong>De bonnes installations d'entraînement</strong> incluant practice et putting green</li>
<li><strong>Des cours disponibles</strong> avec des professionnels PGA</li>
<li><strong>Une atmosphère accueillante</strong> sans pression de jouer rapidement</li>
</ul>

<h2>Les Meilleurs Parcours pour Débutants</h2>

<h3>1. Nice Golf Country Club</h3>
<p>Ce parcours compact de 9 trous est parfait pour les débutants. Situé à seulement 10 minutes du front de mer de Nice, il offre un défi gérable sans être accablant. Le format plus court signifie que vous pouvez terminer un parcours en moins de 2 heures, idéal pour ceux qui développent encore leur endurance et leur confiance.</p>

<h3>2. Golf de la Grande Bastide</h3>
<p>Situé dans un magnifique environnement boisé à Châteauneuf-Grasse, ce parcours est réputé pour être accessible aux joueurs expérimentés comme aux débutants. Les sept plans d'eau ajoutent de la beauté sans être trop punitifs, et le tracé offre plusieurs positions de départ pour s'adapter à votre niveau.</p>

<h3>3. Golf Opio Valbonne</h3>
<p>L'un des joyaux de la Riviera, Opio Valbonne accueille les joueurs de tous niveaux. Le domaine naturel de 220 hectares offre un cadre magnifique, tandis que la conception du parcours propose suffisamment de défis pour vous aider à progresser sans détruire votre confiance.</p>

<h2>Conseils pour les Débutants sur la Côte d'Azur</h2>

<h3>Réservez des Cours</h3>
<p>La plupart des clubs proposent des cours avec des professionnels qualifiés PGA. Même un seul cours peut améliorer considérablement votre jeu et vous aider à éviter de développer de mauvaises habitudes dès le début.</p>

<h3>Commencez par 9 Trous</h3>
<p>Ne vous sentez pas obligé de jouer 18 trous. De nombreux parcours proposent des parties de 9 trous, parfaites pour développer votre jeu progressivement.</p>

<h3>Venez en Heures Creuses</h3>
<p>Les après-midis en semaine sont généralement plus calmes, vous donnant plus de temps pour jouer sans vous sentir pressé.</p>

<h3>Louez d'Abord l'Équipement</h3>
<p>Avant d'investir dans vos propres clubs, louez l'équipement au pro shop. Cela vous permet d'essayer différents clubs et de comprendre ce qui convient à votre jeu.</p>

<h2>Trouver des Partenaires de Jeu</h2>

<p>L'une des meilleures façons de progresser en tant que débutant est de jouer avec des golfeurs plus expérimentés qui peuvent offrir des conseils et des encouragements. French Riviera Golf connecte des joueurs de tous niveaux – créez simplement un profil indiquant que vous êtes débutant, et vous trouverez des partenaires accueillants qui se souviennent de leurs débuts.</p>

<h2>Conclusion</h2>

<p>La Côte d'Azur offre un environnement merveilleux pour apprendre le golf. Le climat méditerranéen signifie que vous pouvez jouer toute l'année, et la culture accueillante de nombreux clubs signifie que vous vous sentirez à l'aise dès votre premier coup de départ. Ne soyez pas intimidé par la réputation glamour – chaque grand golfeur a commencé quelque part, et la Côte d'Azur est un endroit magnifique pour commencer votre voyage.</p>
`
    },
    {
        slug: 'planifier-sejour-golf-cote-azur',
        title: 'Planifier le Séjour Golf Parfait sur la Côte d\'Azur',
        excerpt: 'Tout ce que vous devez savoir pour planifier un voyage golf inoubliable sur la Côte d\'Azur. Meilleure période, hébergement et réservations.',
        category: 'Voyage',
        author: 'French Riviera Golf',
        meta_description: 'Planifiez votre séjour golf parfait sur la Côte d\'Azur. Meilleure période pour visiter, conseils d\'hébergement et recommandations de parcours.',
        content: `
<p>Un séjour golf sur la Côte d'Azur combine des parcours de classe mondiale avec le glamour méditerranéen, une cuisine exceptionnelle et un ensoleillement toute l'année. Voici tout ce que vous devez savoir pour planifier le voyage parfait.</p>

<h2>Meilleure Période pour Visiter</h2>

<p>La Côte d'Azur bénéficie de plus de 300 jours de soleil par an, ce qui en fait une destination golf toute l'année. Cependant, chaque saison offre quelque chose de différent :</p>

<h3>Printemps (Avril - Juin)</h3>
<p>Conditions de golf idéales avec des températures entre 18-25°C. Les parcours sont en excellente condition après l'hiver, et vous éviterez les foules estivales. C'est sans doute la meilleure période pour un voyage axé sur le golf.</p>

<h3>Automne (Septembre - Novembre)</h3>
<p>Similaire au printemps, avec des températures agréables et moins de touristes. La mer est encore assez chaude pour nager après votre partie. Septembre est particulièrement populaire parmi les golfeurs.</p>

<h3>Été (Juillet - Août)</h3>
<p>Les températures chaudes (28-32°C) rendent préférables les départs tôt le matin ou en fin d'après-midi. Réservez bien à l'avance car c'est la haute saison touristique.</p>

<h3>Hiver (Décembre - Mars)</h3>
<p>Des températures douces (10-15°C) permettent un golf confortable. De nombreux parcours offrent des green fees réduits, et vous aurez les parcours presque pour vous seul. Un excellent choix pour échapper aux hivers nord-européens.</p>

<h2>Où Séjourner</h2>

<h3>Région de Cannes</h3>
<p>Séjournez ici pour la plus grande concentration de parcours. Mougins et Mandelieu-La-Napoule vous placent à moins de 20 minutes d'au moins 6 excellents parcours. La ville de Cannes offre d'excellents restaurants et une vie nocturne après votre partie.</p>

<h3>Nice</h3>
<p>La base idéale pour combiner golf et tourisme. Accès facile au Monte-Carlo Golf Club de Monaco, plus des parcours dans les collines au-dessus de la ville. La vieille ville de Nice et la Promenade des Anglais sont parfaites pour les jours de repos.</p>

<h3>Saint-Tropez</h3>
<p>Pour une expérience plus exclusive, installez-vous dans le département du Var. Moins de parcours, mais une qualité exceptionnelle et l'atmosphère légendaire de Saint-Tropez.</p>

<h2>Combien de Parcours Pouvez-Vous Jouer ?</h2>

<p>Un programme de séjour golf typique :</p>

<ul>
<li><strong>Séjour de 3 nuits :</strong> 2-3 parties confortablement</li>
<li><strong>Séjour de 5 nuits :</strong> 4-5 parties avec des jours de repos</li>
<li><strong>Séjour de 7 nuits :</strong> 5-6 parties, parfait pour explorer plusieurs régions</li>
</ul>

<p>Ne surchargez pas votre planning. Laissez du temps pour profiter des autres attractions de la région – la gastronomie, les plages, les villages.</p>

<h2>Budget Green Fees</h2>

<p>Les green fees sur la Côte d'Azur varient considérablement :</p>

<ul>
<li><strong>Parcours économiques :</strong> 50-80€</li>
<li><strong>Milieu de gamme :</strong> 80-150€</li>
<li><strong>Parcours premium :</strong> 150-300€</li>
</ul>

<p>De nombreux parcours offrent des tarifs twilight (généralement après 14h ou 15h) avec 30-50% de réduction. Les forfaits multi-parties peuvent également offrir des économies.</p>

<h2>Se Déplacer</h2>

<p>Une voiture de location est fortement recommandée. Bien que Nice ait d'excellents transports en commun, la plupart des parcours de golf sont dans les collines et la campagne où les bus sont peu fréquents. Le parking est gratuit dans pratiquement tous les parcours.</p>

<h3>Depuis l'Aéroport de Nice</h3>
<ul>
<li>Parcours de la région de Cannes : 30-45 minutes</li>
<li>Région de Monaco : 30 minutes</li>
<li>Région de Saint-Tropez : 90 minutes</li>
</ul>

<h2>Que Mettre dans sa Valise</h2>

<ul>
<li>Tenue de golf smart casual (la plupart des parcours ont des codes vestimentaires)</li>
<li>Crampons souples (certains parcours n'autorisent pas le métal)</li>
<li>Protection solaire (chapeau, crème solaire, lunettes de soleil)</li>
<li>Couches légères pour les parties tôt le matin</li>
<li>Veste imperméable (averses occasionnelles, surtout au printemps)</li>
</ul>

<h2>Réserver les Départs</h2>

<p>Réservez au moins 1-2 semaines à l'avance pour les parcours populaires, surtout en haute saison. De nombreux parcours permettent la réservation en ligne via leurs sites web. Pour les clubs privés les plus prestigieux, vous pourriez avoir besoin d'une lettre d'introduction de votre club d'origine.</p>

<h2>Trouver des Partenaires de Jeu</h2>

<p>Vous voyagez seul ou souhaitez rencontrer des golfeurs locaux ? French Riviera Golf vous connecte avec des joueurs de toute la région. Créez une publication de partie ou marquez-vous comme disponible, et vous trouverez des partenaires qui connaissent les parcours et peuvent partager des conseils d'initiés.</p>

<h2>Au-delà du Golf</h2>

<p>Ne manquez pas les autres attractions de la région :</p>

<ul>
<li>Restaurants étoilés Michelin dans toute la région</li>
<li>Villages médiévaux comme Èze et Saint-Paul-de-Vence</li>
<li>Le casino de Monaco et le Palais Princier</li>
<li>L'atmosphère du Festival de Cannes (mai)</li>
<li>Beach clubs le long de la côte</li>
<li>Dégustation de vins en Provence</li>
</ul>

<h2>Commencez à Planifier</h2>

<p>La Côte d'Azur offre une combinaison inégalée de golf exceptionnel, de style de vie méditerranéen et d'hospitalité de renommée mondiale. Que vous planifiez un voyage golf dédié ou que vous ajoutiez quelques parties à des vacances en famille, la Côte d'Azur offre une expérience inoubliable.</p>
`
    },
    {
        slug: 'histoire-golf-cote-azur',
        title: 'La Riche Histoire du Golf sur la Côte d\'Azur',
        excerpt: 'Des débuts aristocratiques aux sites de championnats modernes, découvrez comment le golf est devenu partie intégrante de l\'identité glamour de la Côte d\'Azur.',
        category: 'Histoire',
        author: 'French Riviera Golf',
        meta_description: 'Explorez l\'histoire fascinante du golf sur la Côte d\'Azur, des premiers parcours des années 1890 aux sites de championnat de classe mondiale d\'aujourd\'hui.',
        content: `
<p>Le golf sur la Côte d'Azur a une histoire aussi glamour que la région elle-même. De la royauté russe aux champions du Tour Européen, la Côte d'Azur attire les golfeurs depuis plus de 130 ans.</p>

<h2>La Naissance du Golf sur la Riviera (1890s)</h2>

<p>Le golf est arrivé sur la Côte d'Azur à la fin du XIXe siècle, apporté par l'aristocratie britannique qui hivernait sur la Côte d'Azur. Le climat méditerranéen doux offrait une échappatoire parfaite aux rudes hivers britanniques, et ces visiteurs fortunés voulaient continuer à pratiquer leur sport bien-aimé.</p>

<h3>Old Course Mandelieu (1891)</h3>
<p>L'histoire commence avec l'Old Course Golf Club de Mandelieu, créé en 1891 par le Grand-Duc Michel de Russie. Cela en fait l'un des plus anciens parcours de golf de France et le plus ancien de la Riviera. Le Grand-Duc, oncle du Tsar Nicolas II, est tombé amoureux de la région et a créé le parcours pour divertir ses compatriotes aristocrates en exil.</p>

<p>Le parcours a accueilli des rois, des reines et des célébrités tout au long de son histoire, maintenant son charme d'antan tout en évoluant avec le jeu.</p>

<h2>L'Âge d'Or (1900-1930)</h2>

<p>Le début du XXe siècle a vu une explosion du golf sur la Riviera, coïncidant avec l'émergence de la région comme la station hivernale la plus à la mode du monde.</p>

<h3>Monte-Carlo Golf Club (1911)</h3>
<p>Perché à 900 mètres d'altitude à La Turbie, avec des vues à couper le souffle sur Monaco et la Méditerranée, le Monte-Carlo Golf Club a été conçu par Willie Park Jr., double vainqueur de l'Open Championship. Le parcours a attiré la royauté et les célébrités de toute l'Europe, cimentant la réputation de la Riviera comme terrain de jeu de l'élite.</p>

<h3>Cannes-Mougins (1923)</h3>
<p>Ce qui a commencé comme un modeste parcours allait devenir l'un des sites les plus prestigieux d'Europe. L'histoire du club est liée aux légendes du golf – il accueillerait plus tard le Tour Européen pendant 14 années consécutives.</p>

<h3>Golf de Biot (1930)</h3>
<p>Originellement appelé Golf de la Bastide du Roy, ce parcours a été créé au pied du célèbre village de verriers de Biot. Conçu par James Peter Gannon et Percy Boomer (l'un des principaux instructeurs de l'époque), il représentait la sensibilité artistique de la région.</p>

<h2>Renaissance d'Après-Guerre (1950s-1980s)</h2>

<p>Après la Seconde Guerre mondiale, la Côte d'Azur s'est réinventée comme destination estivale, et le golf a évolué en parallèle. De nouveaux parcours ont été construits pour répondre à la demande croissante des touristes et d'une classe moyenne française émergente intéressée par ce sport.</p>

<p>Cette époque a vu la construction de :</p>
<ul>
<li>Royal Mougins Golf Club</li>
<li>Golf de Saint-Donat</li>
<li>Riviera Golf de Barbossi</li>
</ul>

<h2>L'Ère du Tour Européen (1980s-2000s)</h2>

<p>Le profil golfique de la Côte d'Azur a atteint de nouveaux sommets lorsque le Tour Européen est arrivé en ville. Le Cannes Open est devenu un rendez-vous incontournable du calendrier du tour, accueilli à Cannes-Mougins de 1984 à 1997.</p>

<h3>Les Champions qui ont Conquis la Riviera</h3>
<ul>
<li><strong>Seve Ballesteros</strong> - A gagné à Cannes-Mougins, montrant son légendaire petit jeu</li>
<li><strong>Ian Woosnam</strong> - A triomphé ici avant sa victoire au Masters</li>
<li><strong>Greg Norman</strong> - Le Grand Requin Blanc a ajouté Cannes à ses victoires mondiales</li>
</ul>

<p>Ces tournois ont attiré l'attention internationale et élevé le standard des parcours de la Riviera au niveau championnat.</p>

<h2>Ère Moderne (2000-Présent)</h2>

<p>La scène golfique actuelle de la Côte d'Azur mélange charme historique et luxe moderne. Les développements majeurs incluent :</p>

<h3>Terre Blanche (2004)</h3>
<p>Ce resort Four Seasons près de Tourrettes comprend deux parcours conçus par Dave Thomas. Le parcours du Château a accueilli le French Riviera Masters du Senior European Tour et représente l'engagement de la région envers un golf de classe mondiale.</p>

<h3>Leadership Environnemental</h3>
<p>Les parcours modernes de la Riviera sont pionniers en matière de golf durable. Terre Blanche est devenu l'un des premiers parcours au monde à recevoir la certification GEO pour la gestion environnementale. La conservation de l'eau et la protection de la biodiversité sont désormais au cœur de la gestion des parcours.</p>

<h2>Architectes Légendaires</h2>

<p>La Côte d'Azur a attiré les plus grands concepteurs de parcours de golf :</p>

<ul>
<li><strong>Willie Park Jr.</strong> - Monte-Carlo Golf Club</li>
<li><strong>Robert Trent Jones Sr.</strong> - Riviera Golf de Barbossi, Estérel Latitudes</li>
<li><strong>Robert Trent Jones Jr.</strong> - Golf de Saint-Donat</li>
<li><strong>Gary Player</strong> - Château de Taulane, Golf de Saint-Tropez</li>
<li><strong>Dave Thomas</strong> - Terre Blanche, rénovation de Cannes-Mougins</li>
<li><strong>Pete Dye</strong> - Golf de Barbaroux</li>
</ul>

<h2>Golf et Glamour</h2>

<p>Tout au long de son histoire, le golf de la Riviera a attiré célébrités et dignitaires :</p>

<ul>
<li>Le Duc de Windsor était un habitué de plusieurs parcours</li>
<li>Sean Connery a joué pendant des tournages de films dans la région</li>
<li>Les célébrités modernes continuent d'être aperçues sur les fairways de la Riviera</li>
</ul>

<p>Ce mélange d'excellence sportive et de cachet social définit le caractère unique du golf de la Côte d'Azur.</p>

<h2>L'Avenir</h2>

<p>Aujourd'hui, la Côte d'Azur offre plus de 20 parcours à moins d'une heure de Nice. La région continue d'évoluer, les parcours investissant dans la durabilité, la technologie et l'expérience des joueurs tout en honorant leur riche patrimoine.</p>

<p>Que vous marchiez sur les mêmes fairways que les Grands-Ducs russes ou les champions du Tour Européen, le golf sur la Côte d'Azur vous connecte à une tradition remarquable qui s'étend sur plus d'un siècle.</p>
`
    },
    {
        slug: 'top-5-parcours-golf-panoramiques-cote-azur',
        title: 'Top 5 des Parcours de Golf les Plus Panoramiques de la Côte d\'Azur',
        excerpt: 'Des panoramas montagneux aux vues méditerranéennes, ces parcours offrent les paysages les plus époustouflants de la Côte d\'Azur.',
        category: 'Guides',
        author: 'French Riviera Golf',
        meta_description: 'Découvrez les 5 parcours de golf les plus panoramiques de la Côte d\'Azur. Vues imprenables sur la Méditerranée, les Alpes et les paysages provençaux.',
        content: `
<p>La Côte d'Azur est bénie d'une beauté naturelle extraordinaire, et ses parcours de golf tirent pleinement parti des paysages spectaculaires. Des vistas alpines aux panoramas méditerranéens, voici les cinq parcours les plus panoramiques de la Côte d'Azur.</p>

<h2>1. Monte-Carlo Golf Club, La Turbie</h2>

<p><strong>La Vue :</strong> Perché à 900 mètres d'altitude, ce parcours offre un panorama à 360 degrés tout simplement inégalé. Regardez vers le bas sur la principauté de Monaco, la Méditerranée s'étendant jusqu'à l'horizon, et par temps clair, apercevez le littoral italien et les montagnes de la Corse.</p>

<p><strong>L'Expérience :</strong> Jouer ici donne l'impression d'être au sommet du monde. L'air plus frais de la montagne offre un soulagement de la chaleur estivale, tandis que les vues peuvent être véritablement distrayantes – vous vous retrouverez à faire une pause en plein swing pour tout absorber.</p>

<p><strong>Meilleurs Trous pour les Vues :</strong> L'ensemble du parcours est spectaculaire, mais les trous le long du bord sud offrent les vues méditerranéennes les plus dramatiques.</p>

<p><strong>Quand Jouer :</strong> Tôt le matin offre les vues les plus claires, avant que la brume de l'après-midi ne se développe.</p>

<h2>2. Château de Taulane, La Martre</h2>

<p><strong>La Vue :</strong> Situé à 1 000 mètres d'altitude dans les contreforts des Alpes, avec les spectaculaires Gorges du Verdon à proximité. Les sommets enneigés encadrent le parcours en hiver et au printemps, tandis que l'environnement montagnard préservé procure un sentiment d'évasion totale.</p>

<p><strong>L'Expérience :</strong> Ce design de Gary Player donne l'impression de découvrir un joyau caché. La tranquillité absolue et le cadre montagnard le distinguent de tout autre parcours de la Riviera. C'est du golf en pleine nature, mais avec des conditions impeccables.</p>

<p><strong>Meilleurs Trous pour les Vues :</strong> Plusieurs trous offrent des vues vers le canyon du Verdon, l'une des merveilles naturelles les plus spectaculaires d'Europe.</p>

<p><strong>Quand Jouer :</strong> De la fin du printemps au début de l'automne. Le parcours peut fermer pendant les mois d'hiver en raison de l'altitude.</p>

<h2>3. Golf de Saint-Tropez, Gassin</h2>

<p><strong>La Vue :</strong> Ce chef-d'œuvre de Gary Player est situé dans un paysage protégé avec des vues sur les villages médiévaux de Gassin, Grimaud et Ramatuelle. Le golfe de Saint-Tropez scintille au loin, tandis que les montagnes des Maures forment une toile de fond dramatique.</p>

<p><strong>L'Expérience :</strong> Le parcours se fond parfaitement dans son environnement, avec des pins parasols, des chênes-lièges et du maquis méditerranéen encadrant chaque trou. L'immense club-house provençal de 1 600 m² ajoute au sentiment d'occasion.</p>

<p><strong>Meilleurs Trous pour les Vues :</strong> Les neuf derniers trous offrent des vistas particulièrement magnifiques vers la mer et les villages environnants.</p>

<p><strong>Quand Jouer :</strong> Le printemps et l'automne offrent la meilleure combinaison de météo et de paysages, avec des fleurs sauvages au printemps ajoutant des couleurs supplémentaires.</p>

<h2>4. Riviera Golf de Barbossi, Mandelieu</h2>

<p><strong>La Vue :</strong> Robert Trent Jones Sr. a conçu ce parcours sur les hauteurs au-dessus de la baie de Cannes, offrant des vues panoramiques sur les roches rouges du massif de l'Estérel, la Méditerranée et les vignobles du Domaine.</p>

<p><strong>L'Expérience :</strong> Ce qui distingue Barbossi est sa combinaison unique de golf et d'art. Des sculptures contemporaines parsèment le parcours, créant des moments de beauté inattendus aux côtés du paysage naturel. Le cadre viticole ajoute un caractère distinctement provençal.</p>

<p><strong>Meilleurs Trous pour les Vues :</strong> Les départs surélevés tout au long du parcours offrent des perspectives panoramiques sur la côte et les montagnes.</p>

<p><strong>Quand Jouer :</strong> Les parties au coucher du soleil sont particulièrement magiques, avec les roches de l'Estérel rougeoyant dans la lumière du soir.</p>

<h2>5. Terre Blanche (Parcours du Château), Tourrettes</h2>

<p><strong>La Vue :</strong> Situé au sein d'un domaine de 300 hectares dans les collines provençales, ce parcours offre un paysage de campagne française classique – des collines ondulantes couvertes de lavande et d'oliviers, d'anciens murs de pierre et des fairways bordés de cyprès.</p>

<p><strong>L'Expérience :</strong> Bien que dépourvu de vues sur la mer, Terre Blanche offre la quintessence de la Provence. Le conditionnement impeccable, combiné au resort de luxe Four Seasons, crée une expérience de beauté raffinée tout au long du parcours.</p>

<p><strong>Meilleurs Trous pour les Vues :</strong> Le parcours serpente à travers des vallées naturelles et sur des crêtes, chaque trou offrant une nouvelle perspective sur le paysage.</p>

<p><strong>Quand Jouer :</strong> Juin-juillet quand la lavande fleurit, ou en automne quand la lumière devient dorée.</p>

<h2>Mentions Honorables</h2>

<h3>Golf de Roquebrune</h3>
<p>Vues spectaculaires sur le massif des Maures depuis une position élevée entre Cannes et Saint-Tropez.</p>

<h3>Golf de Saint-Endréol</h3>
<p>La rivière Endre serpente à travers le parcours, avec l'imposant Rocher de Roquebrune comme point focal dramatique.</p>

<h2>Conseils Photo</h2>

<p>Ces parcours méritent d'être photographiés. Quelques conseils :</p>

<ul>
<li>La lumière du matin est généralement meilleure pour les vues méditerranéennes (moins de brume)</li>
<li>Apportez un petit appareil photo qui ne ralentira pas votre partie</li>
<li>Demandez aux partenaires de jeu avant de photographier pendant leurs coups</li>
<li>Les meilleures photos viennent souvent des départs et des greens, pas pendant votre swing</li>
</ul>

<h2>Au-delà des Fairways</h2>

<p>Chacun de ces parcours offre d'excellentes options de restauration où vous pouvez profiter des vues sans club de golf à la main. Prenez le temps de déjeuner ou de prendre un verre au club-house – sur la Côte d'Azur, s'attarder devant un bon repas avec une belle vue fait partie de l'expérience.</p>

<h2>Jouez Ces Parcours</h2>

<p>Prêt à découvrir ces parcours magnifiques ? Créez un compte gratuit sur French Riviera Golf pour trouver des partenaires de jeu et obtenir des conseils d'initiés de locaux qui connaissent chaque point de vue panoramique.</p>
`
    },
    {
        slug: 'etiquette-golf-cote-azur',
        title: 'L\'Étiquette du Golf sur la Côte d\'Azur : Ce Qu\'il Faut Savoir',
        excerpt: 'Du code vestimentaire au rythme de jeu, comprenez les usages et attentes dans les clubs de golf de la Côte d\'Azur.',
        category: 'Conseils',
        author: 'French Riviera Golf',
        meta_description: 'Apprenez l\'étiquette essentielle du golf sur la Côte d\'Azur. Codes vestimentaires, rythme de jeu et usages pour une excellente expérience.',
        content: `
<p>Les clubs de golf de la Côte d'Azur maintiennent des traditions qui reflètent le caractère élégant de la région. Comprendre l'étiquette locale vous permettra de vous sentir à l'aise et bienvenu sur n'importe quel parcours de la Côte d'Azur.</p>

<h2>Code Vestimentaire</h2>

<p>Les parcours de la Côte d'Azur ont généralement des codes vestimentaires, bien que leur application varie selon les clubs. Voici ce à quoi vous attendre :</p>

<h3>Sur le Parcours</h3>
<ul>
<li><strong>Chemises :</strong> Chemises à col requises dans la plupart des clubs. Les polos de golf sont idéaux.</li>
<li><strong>Pantalons/Shorts :</strong> Pantalons de golf ajustés ou shorts élégants (au-dessus du genou c'est bien). Pas de jean, shorts cargo ou vêtements de sport.</li>
<li><strong>Chaussures :</strong> Chaussures de golf requises, crampons souples fortement préférés. Certains parcours n'autorisent pas les crampons métalliques.</li>
<li><strong>Chapeaux :</strong> Casquettes et visières sont acceptées, mais retirez-les dans le club-house.</li>
</ul>

<h3>Dans le Club-house</h3>
<ul>
<li>Tenue smart casual attendue</li>
<li>Retirer les chapeaux à l'intérieur</li>
<li>Changer de chaussures de golf avant d'entrer dans les restaurants</li>
<li>Dans les clubs prestigieux, une veste peut être requise pour le dîner</li>
</ul>

<h3>À Éviter</h3>
<ul>
<li>Jeans ou denim de toute couleur</li>
<li>T-shirts sans col</li>
<li>Maillots de football ou vêtements de sport</li>
<li>Tongs ou sandales</li>
<li>Maillots de bain (même dans les parcours de resort)</li>
</ul>

<h2>Rythme de Jeu</h2>

<p>L'approche française du rythme de jeu équilibre efficacité et plaisir. Se presser est considéré comme impoli, mais retenir les autres joueurs l'est aussi.</p>

<h3>Durées de Partie Attendues</h3>
<ul>
<li><strong>18 trous :</strong> 4 à 4h30</li>
<li><strong>9 trous :</strong> 2 heures</li>
</ul>

<h3>Conseils pour un Bon Rythme</h3>
<ul>
<li>Jouez "ready golf" – soyez prêt à frapper quand c'est sûr, n'attendez pas toujours le joueur le plus éloigné</li>
<li>Limitez les swings d'entraînement à un ou deux</li>
<li>Marchez rapidement entre les coups</li>
<li>Lisez les putts pendant que les autres jouent</li>
<li>Quittez le green rapidement, marquez les scores au départ suivant</li>
<li>Si vous prenez du retard, laissez les groupes plus rapides passer</li>
</ul>

<h2>Au Départ</h2>

<h3>Commencer Votre Partie</h3>
<ul>
<li>Arrivez au moins 30 minutes avant votre heure de départ</li>
<li>Enregistrez-vous au pro shop</li>
<li>Soyez au premier départ 5-10 minutes en avance</li>
<li>Présentez-vous à vos partenaires de jeu si vous ne les connaissez pas</li>
</ul>

<h3>Étiquette au Départ</h3>
<ul>
<li>Restez immobile et silencieux quand les autres frappent</li>
<li>Positionnez-vous hors du champ de vision périphérique du joueur</li>
<li>Ne vous tenez pas directement derrière la balle</li>
<li>Replacez les divots ou utilisez le mélange de graines fourni</li>
</ul>

<h2>Sur le Fairway</h2>

<ul>
<li>Réparez tous les divots – utilisez le mélange de graines où il est fourni</li>
<li>Gardez les voiturettes sur les chemins désignés quand c'est requis</li>
<li>Ne conduisez pas les voiturettes près des greens ou des départs</li>
<li>Ratissez les bunkers après utilisation, laissant le râteau selon la politique du club</li>
<li>Criez "Fore!" (ou "Attention!") fort si votre balle risque de toucher quelqu'un</li>
</ul>

<h2>Sur le Green</h2>

<ul>
<li>Réparez les impacts de balle – les vôtres et ceux que vous voyez</li>
<li>Ne marchez pas sur les lignes de putt des autres joueurs</li>
<li>Ne vous tenez pas dans la ligne de vision de quelqu'un pendant qu'il putte</li>
<li>Tenez le drapeau si demandé, retirez-le quand tous les joueurs sont sur le green</li>
<li>Quittez le green rapidement une fois que tous les joueurs ont terminé</li>
</ul>

<h2>Téléphones Portables</h2>

<ul>
<li>Mettez les téléphones en silencieux avant d'atteindre le premier départ</li>
<li>Gardez les appels brefs et éloignés des autres joueurs</li>
<li>La photographie est généralement autorisée, mais demandez avant de photographier d'autres joueurs</li>
<li>N'utilisez jamais les téléphones sur le green</li>
</ul>

<h2>Étiquette avec les Caddies</h2>

<p>Certains clubs prestigieux offrent des services de caddie :</p>

<ul>
<li>Écoutez leurs conseils – ils connaissent intimement le parcours</li>
<li>Donnez un pourboire approprié (30-50€ pour 18 trous est standard)</li>
<li>Traitez-les avec respect ; beaucoup sont eux-mêmes des golfeurs expérimentés</li>
</ul>

<h2>Au 19ème Trou</h2>

<p>Les boissons d'après-partie sont une tradition chérie sur la Riviera :</p>

<ul>
<li>Proposez d'offrir une tournée à vos partenaires de jeu</li>
<li>Gardez les conversations golf positives – évitez les analyses interminables de chaque mauvais coup</li>
<li>Remerciez vos partenaires pour la partie</li>
<li>Réglez les paris avec élégance</li>
</ul>

<h2>Culture du Pourboire</h2>

<p>Le pourboire en France est plus modeste que dans certains pays :</p>

<ul>
<li><strong>Caddies :</strong> 30-50€ pour 18 trous</li>
<li><strong>Dépôt/nettoyage des sacs :</strong> 2-5€</li>
<li><strong>Personnel des vestiaires :</strong> 1-2€ s'ils vous assistent</li>
<li><strong>Restaurants :</strong> 5-10% pour un service exceptionnel (le service est généralement inclus)</li>
</ul>

<h2>L'Esprit du Jeu</h2>

<p>Avant tout, le golf de la Côte d'Azur incarne l'esprit du jeu – honnêteté, respect et plaisir. Appelez les pénalités sur vous-même, félicitez les bons coups de vos partenaires, et rappelez-vous que même sur les parcours les plus prestigieux, nous sommes tous là pour nous amuser.</p>

<p>Bienvenue au golf sur la Côte d'Azur. Jouez bien, jouez fair-play, et savourez chaque instant.</p>
`
    }
];

async function seedBlogFR() {
    console.log('Seeding French blog posts...\n');

    for (const post of blogPostsFR) {
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

    console.log('\nFrench blog seeding complete!');
    process.exit(0);
}

seedBlogFR();
