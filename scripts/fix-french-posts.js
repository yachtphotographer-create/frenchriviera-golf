require('dotenv').config();
const db = require('../config/database');

async function fixFrenchPosts() {
    try {
        // Fix post 3
        await db.query(`
            UPDATE blog_posts
            SET title = $1,
                excerpt = $2,
                meta_description = $3,
                content = $4,
                slug = $5
            WHERE id = 3
        `, [
            "Quelle Est la Meilleure Période pour Jouer au Golf sur la Côte d'Azur : Guide Saisonnier",
            "Quand partir pour un séjour golf sur la Côte d'Azur ? Notre guide saisonnier vous aide à planifier la visite parfaite.",
            "Découvrez la meilleure période pour jouer au golf sur la Côte d'Azur. Guide saisonnier complet : météo, tarifs et conseils pour chaque saison.",
            `<p>La Côte d'Azur bénéficie de plus de 300 jours d'ensoleillement par an, ce qui en fait une destination golf toute l'année. Cependant, chaque saison offre une expérience différente. Voici quand visiter selon vos priorités.</p>

<h2>Printemps (Mars - Mai) : Le Moment Idéal</h2>
<p><strong>Météo :</strong> 15-22°C, quelques averses possibles en mars</p>
<p><strong>Avantages :</strong></p>
<ul>
<li>Températures parfaites pour jouer</li>
<li>Parcours en excellent état après l'entretien hivernal</li>
<li>Moins de monde qu'en été</li>
<li>Green fees plus abordables qu'en haute saison</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
<li>La météo peut être variable en début de saison</li>
</ul>

<h2>Été (Juin - Août) : Haute Saison</h2>
<p><strong>Météo :</strong> 25-32°C, très ensoleillé</p>
<p><strong>Avantages :</strong></p>
<ul>
<li>Journées longues permettant des départs tardifs</li>
<li>Météo garantie</li>
<li>Ambiance animée sur la Riviera</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
<li>Chaleur intense en milieu de journée</li>
<li>Green fees les plus élevés</li>
<li>Réservations obligatoires bien à l'avance</li>
</ul>
<p><strong>Conseil :</strong> Réservez les départs tôt le matin (avant 9h) ou en fin d'après-midi pour éviter la chaleur.</p>

<h2>Automne (Septembre - Novembre) : Le Choix des Connaisseurs</h2>
<p><strong>Météo :</strong> 18-25°C, quelques pluies possibles en novembre</p>
<p><strong>Avantages :</strong></p>
<ul>
<li>Conditions de jeu excellentes</li>
<li>Moins de touristes</li>
<li>Tarifs plus attractifs</li>
<li>Les vendanges offrent un cadre magnifique</li>
</ul>

<h2>Hiver (Décembre - Février) : Golf et Ski</h2>
<p><strong>Météo :</strong> 10-15°C, généralement sec et ensoleillé</p>
<p><strong>Avantages :</strong></p>
<ul>
<li>Green fees les plus bas de l'année</li>
<li>Parcours disponibles sans réservation</li>
<li>Possibilité unique de skier le matin et jouer au golf l'après-midi</li>
</ul>
<p><strong>Inconvénients :</strong></p>
<ul>
<li>Journées plus courtes</li>
<li>Certains parcours en entretien</li>
</ul>

<h2>Notre Recommandation</h2>
<p>Pour le meilleur rapport qualité-prix et conditions de jeu, nous recommandons <strong>avril-mai</strong> ou <strong>septembre-octobre</strong>. Ces périodes offrent une météo idéale, des tarifs raisonnables et des parcours dans un état impeccable.</p>`,
            "meilleure-periode-golf-cote-azur-guide"
        ]);
        console.log('Post 3 updated successfully');

        // Fix post 7
        await db.query(`
            UPDATE blog_posts
            SET title = $1,
                excerpt = $2,
                meta_description = $3,
                content = $4,
                slug = $5
            WHERE id = 7
        `, [
            "Planifier le Séjour Golf Parfait sur la Côte d'Azur",
            "Tout ce qu'il faut savoir pour planifier un voyage golf inoubliable sur la Côte d'Azur. Meilleure période, hébergements et réservations.",
            "Guide complet pour organiser votre séjour golf sur la Côte d'Azur : meilleure période, où séjourner, comment réserver et conseils pratiques.",
            `<p>Un séjour golf sur la Côte d'Azur combine parcours de classe mondiale, glamour méditerranéen, gastronomie exceptionnelle et ensoleillement toute l'année. Voici tout ce qu'il faut savoir pour planifier le voyage parfait.</p>

<h2>Meilleure Période pour Visiter</h2>
<p>La Côte d'Azur bénéficie de plus de 300 jours d'ensoleillement par an, ce qui en fait une destination golf toute l'année. Cependant, chaque saison offre quelque chose de différent :</p>

<h3>Printemps (Avril - Juin)</h3>
<p>Météo idéale pour le golf avec des températures entre 18-25°C. Les parcours sont en parfait état après l'entretien hivernal, et les tarifs sont plus raisonnables qu'en été.</p>

<h3>Été (Juillet - Août)</h3>
<p>Haute saison avec des températures chaudes (25-32°C). Réservez tôt le matin ou en fin d'après-midi pour éviter la chaleur. Ambiance animée mais tarifs élevés.</p>

<h3>Automne (Septembre - Octobre)</h3>
<p>Notre période préférée ! Temps excellent, moins de monde, et tarifs attractifs. Les vendanges ajoutent au charme de la région.</p>

<h3>Hiver (Novembre - Mars)</h3>
<p>Golf possible toute l'année avec des températures douces (10-15°C). Tarifs les plus bas et possibilité unique de skier le matin dans les Alpes et jouer au golf l'après-midi.</p>

<h2>Où Séjourner</h2>
<h3>Pour le Luxe : Monaco / Cap-Ferrat</h3>
<p>Hôtels 5 étoiles, accès facile au Monte-Carlo Golf Club, et ambiance prestigieuse.</p>

<h3>Pour les Golfeurs : Mougins / Valbonne</h3>
<p>Au cœur des parcours de la région, avec Royal Mougins, Cannes-Mougins et plusieurs autres à proximité.</p>

<h3>Pour le Rapport Qualité-Prix : Cannes / Antibes</h3>
<p>Bonne situation centrale, large choix d'hébergements, et vie nocturne animée.</p>

<h3>Pour la Tranquillité : Terre Blanche</h3>
<p>Resort 5 étoiles avec deux parcours sur place, spa et académie de golf.</p>

<h2>Comment Réserver</h2>
<ul>
<li><strong>Green fees :</strong> Réservez directement auprès des parcours ou via notre plateforme pour trouver des partenaires</li>
<li><strong>Période haute saison :</strong> Réservez 2-4 semaines à l'avance minimum</li>
<li><strong>Packages :</strong> Certains hôtels proposent des forfaits golf incluant green fees et transferts</li>
</ul>

<h2>Conseils Pratiques</h2>
<ul>
<li>Louez une voiture pour accéder facilement aux différents parcours</li>
<li>Prévoyez des vêtements adaptés : code vestimentaire requis sur la plupart des parcours</li>
<li>Apportez de la crème solaire même en hiver</li>
<li>Inscrivez-vous sur French Riviera Golf pour trouver des partenaires locaux</li>
</ul>

<h2>Budget Estimatif</h2>
<p>Pour un séjour golf d'une semaine sur la Côte d'Azur :</p>
<ul>
<li><strong>Green fees :</strong> 80-200€ par parcours selon le prestige</li>
<li><strong>Hébergement :</strong> 100-500€ par nuit selon le standing</li>
<li><strong>Location voiture :</strong> 50-80€ par jour</li>
<li><strong>Repas :</strong> 30-100€ par jour</li>
</ul>`,
            "planifier-sejour-golf-parfait-cote-azur"
        ]);
        console.log('Post 7 updated successfully');

        console.log('All French posts fixed!');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixFrenchPosts();
