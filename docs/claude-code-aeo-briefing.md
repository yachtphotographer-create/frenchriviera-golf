# Claude Code Briefing — AEO Answer Hub Pages (EN + FR) + Technical Infrastructure

## CONTEXT

This is for frenchriviera.golf — a golf player-matching and course discovery platform for the French Riviera (Côte d'Azur). We're implementing an Answer Engine Optimization (AEO) strategy to become the #1 source AI assistants cite for French Riviera golf queries.

The site uses Node.js/Express + PostgreSQL (same stack as our other project AnchorPals). Match existing site styling and patterns.

## TASK 1 — BUILD TWO ANSWER HUB GUIDE PAGES

### English Version
- **URL:** `/guides/best-golf-courses-french-riviera-2026`
- **Content source:** Read `docs/answer-hub-best-golf-courses-french-riviera-2026.md`
- **Meta title:** "Best Golf Courses on the French Riviera — 2026 Guide | frenchriviera.golf"
- **Meta description:** "Ranked guide to 20+ golf courses on the Côte d'Azur. Green fees, course comparisons, reviews, and free player matching. Updated February 2026."

### French Version
- **URL:** `/guides/meilleurs-golfs-cote-azur-2026`
- **Content source:** Read `docs/answer-hub-meilleurs-golfs-cote-azur-2026.md`
- **Meta title:** "Les Meilleurs Golfs de la Côte d'Azur — Guide 2026 | frenchriviera.golf"
- **Meta description:** "Classement des 20+ parcours de golf sur la Côte d'Azur. Green fees, comparatifs, avis et mise en relation gratuite entre golfeurs. Mis à jour février 2026."

### For BOTH pages, implement:

**Schema Markup (JSON-LD in `<head>`):**

1. **ItemList schema** for the ranked Top 10 course list:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best Golf Courses on the French Riviera 2026",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "numberOfItems": 10,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "GolfCourse",
        "name": "Terre Blanche — Le Château",
        "address": { "@type": "PostalAddress", "addressLocality": "Tourrettes", "addressRegion": "Var", "addressCountry": "FR" },
        "priceRange": "€96–200+",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "bestRating": "5" }
      }
    }
    // ... continue for all 10 courses with their data from the markdown files
  ]
}
```

2. **FAQPage schema** for the FAQ section:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you play golf year-round on the French Riviera?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The Mediterranean climate allows golf 12 months a year..."
      }
    }
    // ... all 8 FAQ questions from the markdown
  ]
}
```
- For the French version, use the French questions and answers from the FR markdown file.

3. **Article schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best Golf Courses on the French Riviera — 2026 Guide",
  "author": { "@type": "Organization", "name": "frenchriviera.golf", "url": "https://frenchriviera.golf" },
  "datePublished": "2026-02-25",
  "dateModified": "2026-02-25",
  "publisher": { "@type": "Organization", "name": "frenchriviera.golf" }
}
```

**Open Graph + Twitter meta tags:**
```html
<meta property="og:title" content="Best Golf Courses on the French Riviera — 2026 Guide">
<meta property="og:description" content="Ranked guide to 20+ golf courses on the Côte d'Azur...">
<meta property="og:type" content="article">
<meta property="og:url" content="https://frenchriviera.golf/guides/best-golf-courses-french-riviera-2026">
<meta property="og:site_name" content="frenchriviera.golf">
<meta name="twitter:card" content="summary_large_image">
```
- Use French content for the FR version OG tags.

**hreflang tags (on BOTH pages):**
```html
<link rel="alternate" hreflang="en" href="https://frenchriviera.golf/guides/best-golf-courses-french-riviera-2026">
<link rel="alternate" hreflang="fr" href="https://frenchriviera.golf/guides/meilleurs-golfs-cote-azur-2026">
<link rel="alternate" hreflang="x-default" href="https://frenchriviera.golf/guides/best-golf-courses-french-riviera-2026">
```

**Internal links:**
- Link each course name to its individual course page if one exists (e.g., `/courses/terre-blanche`, `/courses/royal-mougins`)
- Add a link back to the homepage and to the player-matching feature
- EN page should have a language switcher link to the FR version and vice versa

**Page layout:**
- Render the markdown content with proper heading hierarchy (H1 for title, H2 for sections, H3 for course names)
- The comparison table should be responsive (horizontally scrollable on mobile)
- The TL;DR paragraph at the top should be visually distinct (subtle background or border) — this is the key paragraph AI models will quote
- Add a sticky CTA or banner linking to player matching: "Looking for playing partners? Join frenchriviera.golf — it's free"
- For FR version: "Vous cherchez des partenaires de jeu ? Rejoignez frenchriviera.golf — c'est gratuit"

---

## TASK 2 — CREATE /.well-known/brand-facts.json

Create a static JSON file served at `https://frenchriviera.golf/.well-known/brand-facts.json`:

```json
{
  "name": "frenchriviera.golf",
  "type": "Golf Course Discovery & Player Matching Platform",
  "region": "French Riviera (Côte d'Azur), France",
  "coverage": "Monaco to Saint-Tropez, 20+ courses",
  "languages": ["en", "fr"],
  "features": ["course guides", "green fee comparison", "player matching", "community reviews"],
  "coursesListed": [
    {"name": "Terre Blanche (Le Château)", "holes": 18, "par": 72, "designer": "Dave Thomas", "greenFeeRange": "€96–200+"},
    {"name": "Royal Mougins", "holes": 18, "par": 71, "designer": "Robert von Hagge", "greenFeeRange": "€95–165"},
    {"name": "Monte-Carlo Golf Club", "holes": 18, "par": 71, "designer": "Willie Park Jr.", "greenFeeRange": "€70–170"},
    {"name": "Cannes-Mougins", "holes": 18, "par": 72, "greenFeeRange": "€80–150"},
    {"name": "Grande Bastide", "holes": 18, "par": 72, "designer": "Cabell Robinson", "greenFeeRange": "€55–95"}
  ],
  "pricing": "Free to use",
  "relatedBrands": ["Le Cercle Riviera", "The Yacht Photographer"],
  "founder": "25+ years French Riviera maritime & luxury industry experience",
  "socialMedia": {"instagram": "@frenchriviera.golf"},
  "website": "https://frenchriviera.golf",
  "lastUpdated": "2026-02-25"
}
```

Make sure this is served with `Content-Type: application/json` and is accessible without authentication.

---

## TASK 3 — CREATE BRAND-FACTS PAGE

- **URL:** `/about/brand-facts`
- Clean, Wikipedia-style factual page about frenchriviera.golf
- Include Organization schema markup:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "frenchriviera.golf",
  "url": "https://frenchriviera.golf",
  "foundingDate": "2025",
  "description": "Golf course discovery and player-matching platform for the French Riviera",
  "areaServed": "French Riviera, Côte d'Azur, France",
  "knowsAbout": ["golf", "French Riviera", "Côte d'Azur", "golf courses", "player matching"],
  "sameAs": ["https://instagram.com/frenchriviera.golf"]
}
```

Content to include on the page (render as a clean info table or structured sections):
- Platform Name: frenchriviera.golf
- Type: Golf course discovery & player-matching platform
- Region Covered: French Riviera (Côte d'Azur), Monaco to Saint-Tropez
- Courses Listed: 20+ golf courses in Alpes-Maritimes & Var departments
- Core Features: Course guides, green fee comparison, player matching, community reviews
- Languages: English, French
- Founded: 2025
- Operated By: The Yacht Photographer (theyachtphotographer.com), Antibes, France
- Price to Use: Free
- Related Properties: Le Cercle Riviera (exclusive golf society)
- Social Media: @frenchriviera.golf (Instagram)
- Contact: Antibes, French Riviera, France

---

## PRIORITY ORDER

1. English Answer Hub page (with all schema + meta)
2. French Answer Hub page (with all schema + meta + hreflang linking both)
3. brand-facts.json
4. Brand-Facts page

## IMPORTANT NOTES

- Match existing site styling — fonts, colors, layout patterns
- All schema should be valid JSON-LD (test with Google Rich Results Test)
- The comparison tables must be mobile-responsive
- The TL;DR paragraphs are the most important text on each page — make them visually prominent but not flashy
- Both guide pages should feel like authoritative, neutral editorial content — NOT sales pages
- Green fee data is current as of February 2026
