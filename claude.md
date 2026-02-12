# frenchriviera.golf — Claude Code Project Briefing

## CONTEXT

This is a new project called **frenchriviera.golf** — a player-matching platform that connects golfers looking for playing partners on the French Riviera (Côte d'Azur, France).

The developer (Joce) has an existing project called **AnchorPals** (anchorpals.com) which connects yacht crews with local helpers for docking assistance. frenchriviera.golf follows the **exact same architectural pattern** but adapted for golf. AnchorPals runs Node.js/Express + PostgreSQL on an Ubuntu VPS. Use the same stack and patterns.

**Domain:** frenchriviera.golf (already purchased)

---

## PROJECT OVERVIEW

### What It Does
- Golfers create profiles with their golf details (handicap, preferences, courses they play)
- A golfer can **create a game** (post a tee time request seeking 1-3 partners)
- A golfer can **make themselves available** (mark dates/times/courses where they want to play)
- Golfers browse **open games** and request to join, or game creators browse **available players** and invite them
- Once matched and confirmed, a **group chat** opens for coordination
- After the round, players **rate each other** (building trust for future matches)

### What Makes It Different
- **Hyper-local focus**: French Riviera only (~30 golf courses across Alpes-Maritimes and Var departments)
- **Bilingual**: English and French from day one
- **SEO content layer**: Each golf course gets a rich page (guide, scorecard, reviews, practical info) driving organic traffic
- **Simple**: No social media bloat — just match, chat, play, rate

---

## TECH STACK

Use the same stack as AnchorPals:

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (LTS) |
| **Framework** | Express.js |
| **Database** | PostgreSQL with PostGIS extension (for geo queries) |
| **Frontend** | Server-side rendered EJS templates OR Next.js (discuss with developer — preference is for simplicity) |
| **Auth** | Email + password with bcrypt, email verification, session-based (express-session + connect-pg-simple) |
| **File Storage** | Local filesystem for profile photos (same as AnchorPals) |
| **Maps** | Leaflet.js with OpenStreetMap tiles (free) or Google Maps |
| **Real-time Chat** | Socket.io (simple WebSocket implementation) |
| **Email** | Nodemailer with SMTP (or Resend/Postmark) |
| **Hosting** | Ubuntu VPS (same server as AnchorPals or new VPS) |
| **Process Manager** | PM2 |
| **Reverse Proxy** | Nginx |
| **SSL** | Let's Encrypt (certbot) |

---

## DATABASE SCHEMA

### Table: `users`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMPTZ,

    -- Identity
    display_name VARCHAR(100) NOT NULL,
    profile_photo VARCHAR(500),
    nationality VARCHAR(100),
    languages TEXT[], -- e.g. {'English', 'French', 'Italian'}
    bio TEXT,
    location_type VARCHAR(20) CHECK (location_type IN ('resident', 'visitor', 'seasonal')),
    location_city VARCHAR(100),
    visiting_from DATE,
    visiting_until DATE,
    phone VARCHAR(50),
    phone_verified BOOLEAN DEFAULT FALSE,

    -- Golf Details
    handicap DECIMAL(4,1), -- e.g. 12.3, NULL if not declared
    handicap_type VARCHAR(20) CHECK (handicap_type IN ('official', 'self_declared', 'none')),
    playing_level VARCHAR(20) CHECK (playing_level IN ('beginner', 'intermediate', 'advanced', 'scratch')),
    pace_preference VARCHAR(20) CHECK (pace_preference IN ('relaxed', 'normal', 'fast')),
    transport_preference VARCHAR(20) CHECK (transport_preference IN ('buggy', 'walking', 'trolley', 'caddy')),
    typical_tee_time VARCHAR(20) CHECK (typical_tee_time IN ('early_bird', 'morning', 'afternoon')),
    usual_days VARCHAR(20) CHECK (usual_days IN ('weekdays', 'weekends', 'both')),

    -- Social/Vibe
    vibe VARCHAR(20) CHECK (vibe IN ('competitive', 'social', 'networking', 'learning')),
    group_preference VARCHAR(30) CHECK (group_preference IN ('mixed', 'same_level', 'beginners_welcome')),
    post_round VARCHAR(20) CHECK (post_round IN ('lunch', 'drinks', 'quick_exit')),

    -- Stats (auto-calculated)
    games_played INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);
```

### Table: `courses`
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL, -- URL-friendly: "monte-carlo-golf-club"
    city VARCHAR(100),
    department VARCHAR(5), -- '06' or '83'
    department_name VARCHAR(50), -- 'Alpes-Maritimes' or 'Var'
    address TEXT,
    phone VARCHAR(50),
    website VARCHAR(300),
    email VARCHAR(255),

    -- Course Details
    holes INTEGER, -- 9 or 18
    par INTEGER,
    course_length_meters INTEGER,
    slope_rating INTEGER,
    course_rating DECIMAL(4,1),
    max_handicap INTEGER,
    architect VARCHAR(200),
    year_opened INTEGER,

    -- GPS
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    -- If PostGIS: location GEOGRAPHY(POINT, 4326),

    -- Facilities (booleans)
    driving_range BOOLEAN DEFAULT FALSE,
    putting_green BOOLEAN DEFAULT FALSE,
    chipping_green BOOLEAN DEFAULT FALSE,
    practice_bunker BOOLEAN DEFAULT FALSE,
    buggy_available BOOLEAN DEFAULT FALSE,
    trolley_available BOOLEAN DEFAULT FALSE,
    caddy_available BOOLEAN DEFAULT FALSE,
    club_rental BOOLEAN DEFAULT FALSE,
    pro_shop BOOLEAN DEFAULT FALSE,
    golf_lessons BOOLEAN DEFAULT FALSE,
    restaurant BOOLEAN DEFAULT FALSE,
    hotel_onsite BOOLEAN DEFAULT FALSE,
    swimming_pool BOOLEAN DEFAULT FALSE,
    spa BOOLEAN DEFAULT FALSE,

    -- Content (for SEO pages)
    description_en TEXT,
    description_fr TEXT,
    signature_holes TEXT, -- Description of best holes
    insider_tips TEXT,
    green_fee_info TEXT, -- Pricing notes
    dress_code TEXT,
    booking_info TEXT,
    photos TEXT[], -- Array of photo URLs/paths

    -- Meta
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `user_courses` (many-to-many: user's course associations)
```sql
CREATE TABLE user_courses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    relationship VARCHAR(20) CHECK (relationship IN ('home_course', 'played', 'wishlist')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, relationship)
);
```

### Table: `games` (tee time requests)
```sql
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id),
    
    -- When
    game_date DATE NOT NULL,
    tee_time TIME NOT NULL,
    
    -- Who
    spots_total INTEGER CHECK (spots_total BETWEEN 1 AND 3), -- spots to fill (not including creator)
    spots_filled INTEGER DEFAULT 0,
    
    -- Preferences
    level_min VARCHAR(20),
    level_max VARCHAR(20),
    pace_preference VARCHAR(20),
    transport_preference VARCHAR(20),
    language_preference TEXT[], -- e.g. {'English'}
    
    -- Details
    note TEXT, -- "Looking for a fun round, drinks after"
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'confirmed', 'completed', 'cancelled')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `game_players` (who's in a game)
```sql
CREATE TABLE game_players (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('creator', 'player')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
    invited_by INTEGER REFERENCES users(id), -- NULL if player requested to join
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, user_id)
);
```

### Table: `availability` (players making themselves available)
```sql
CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    time_window VARCHAR(20) CHECK (time_window IN ('early_bird', 'morning', 'afternoon', 'all_day')),
    course_id INTEGER REFERENCES courses(id), -- NULL = any course
    area VARCHAR(50), -- 'cannes', 'nice', 'monaco', 'saint-tropez', 'any'
    note TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `messages` (group chat per game)
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `ratings` (post-game reviews)
```sql
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rated_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Individual scores (1-5)
    punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
    pace_of_play INTEGER CHECK (pace_of_play BETWEEN 1 AND 5),
    friendliness INTEGER CHECK (friendliness BETWEEN 1 AND 5),
    would_play_again INTEGER CHECK (would_play_again BETWEEN 1 AND 5),
    
    -- Calculated average
    overall DECIMAL(3,2),
    
    -- Optional comment
    comment TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, rater_id, rated_id)
);
```

### Table: `course_reviews` (user reviews of courses, for SEO pages)
```sql
CREATE TABLE course_reviews (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    content TEXT,
    date_played DATE,
    
    -- Specific ratings
    course_condition INTEGER CHECK (course_condition BETWEEN 1 AND 5),
    value_for_money INTEGER CHECK (value_for_money BETWEEN 1 AND 5),
    facilities INTEGER CHECK (facilities BETWEEN 1 AND 5),
    scenery INTEGER CHECK (scenery BETWEEN 1 AND 5),
    
    approved BOOLEAN DEFAULT FALSE, -- moderation
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `notifications`
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'game_request', 'game_accepted', 'game_declined', 'new_message', 'rating_received', 'invitation'
    title VARCHAR(200),
    message TEXT,
    link VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## PROJECT STRUCTURE

```
frenchriviera-golf/
├── package.json
├── .env
├── .env.example
├── server.js                    # Express app entry point
├── config/
│   ├── database.js              # PostgreSQL connection pool
│   └── session.js               # Session config
├── middleware/
│   ├── auth.js                  # isAuthenticated, isVerified
│   └── upload.js                # Multer config for profile photos
├── routes/
│   ├── auth.js                  # /auth/register, /auth/login, /auth/verify, /auth/logout
│   ├── profile.js               # /profile, /profile/edit, /profile/photo
│   ├── games.js                 # /games, /games/create, /games/:id, /games/:id/join, /games/:id/invite
│   ├── availability.js          # /availability, /availability/create, /availability/delete
│   ├── chat.js                  # /chat/:gameId (WebSocket + REST fallback)
│   ├── ratings.js               # /ratings/create, /ratings/:userId
│   ├── courses.js               # /courses, /courses/:slug (SEO pages)
│   ├── reviews.js               # /courses/:slug/review
│   └── api.js                   # JSON API endpoints for AJAX calls
├── models/                      # Database queries (raw SQL or simple query builders)
│   ├── User.js
│   ├── Game.js
│   ├── Course.js
│   ├── Rating.js
│   ├── Message.js
│   ├── Availability.js
│   └── Notification.js
├── views/                       # EJS templates
│   ├── layouts/
│   │   └── main.ejs             # Base layout with nav, footer
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   ├── nav.ejs
│   │   ├── game-card.ejs        # Reusable game listing card
│   │   ├── player-card.ejs      # Reusable player card
│   │   └── course-card.ejs      # Reusable course card
│   ├── auth/
│   │   ├── register.ejs
│   │   ├── login.ejs
│   │   └── verify.ejs
│   ├── profile/
│   │   ├── view.ejs             # Public profile
│   │   └── edit.ejs             # Edit own profile
│   ├── games/
│   │   ├── index.ejs            # Browse open games
│   │   ├── create.ejs           # Create a game form
│   │   ├── detail.ejs           # Game detail with players, chat, actions
│   │   └── my-games.ejs         # My created/joined games
│   ├── availability/
│   │   ├── index.ejs            # Browse available players
│   │   └── create.ejs           # Set your availability
│   ├── courses/
│   │   ├── index.ejs            # All courses directory
│   │   ├── detail.ejs           # Individual course page (SEO)
│   │   └── review-form.ejs
│   ├── dashboard.ejs            # User dashboard (overview of games, notifications)
│   └── home.ejs                 # Landing page
├── public/
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   ├── app.js               # Global JS
│   │   ├── chat.js              # Socket.io client for game chat
│   │   └── games.js             # Game filtering, AJAX interactions
│   ├── images/
│   │   ├── logo.svg
│   │   └── og-image.jpg
│   └── uploads/
│       └── profiles/            # User profile photos
├── data/
│   └── courses-seed.json        # Initial course data for seeding
├── scripts/
│   ├── seed-courses.js          # Import course data into DB
│   ├── create-tables.js         # Run CREATE TABLE statements
│   └── fetch-courses-api.js     # Pull from GolfCourseAPI.com
├── utils/
│   ├── email.js                 # Email sending helper
│   ├── notifications.js         # Create notification helper
│   └── helpers.js               # Date formatting, slug generation, etc.
└── ecosystem.config.js          # PM2 config
```

---

## KEY PAGES & ROUTES

### Public (no auth required)
| Route | Page | Purpose |
|-------|------|---------|
| `GET /` | Landing page | Value proposition, CTA to register, featured courses |
| `GET /courses` | Course directory | All ~30 Riviera courses with filters, map |
| `GET /courses/:slug` | Course detail | Rich SEO page: description, scorecard, facilities, reviews, "find a game here" CTA |
| `GET /auth/register` | Registration | Email, password, display name |
| `GET /auth/login` | Login | Email + password |
| `GET /auth/verify/:token` | Email verification | Confirm email |

### Authenticated
| Route | Page | Purpose |
|-------|------|---------|
| `GET /dashboard` | Dashboard | Overview: upcoming games, notifications, quick actions |
| `GET /profile` | My profile | View own profile |
| `GET /profile/edit` | Edit profile | Full profile form (all fields from schema) |
| `POST /profile/photo` | Upload photo | Profile photo upload |
| `GET /profile/:id` | Public profile | View another player's profile + ratings |
| `GET /games` | Open games board | Browse available games with filters (date, course, area, level) |
| `GET /games/create` | Create game | Form: course, date, time, spots, preferences, note |
| `POST /games/create` | Submit game | Save and publish |
| `GET /games/:id` | Game detail | Full info, players list, chat, join/invite actions |
| `POST /games/:id/join` | Request to join | Player requests to join a game |
| `POST /games/:id/accept/:playerId` | Accept player | Creator accepts a join request |
| `POST /games/:id/decline/:playerId` | Decline player | Creator declines |
| `POST /games/:id/invite/:userId` | Invite player | Creator invites an available player |
| `GET /games/mine` | My games | Created + joined games, past + upcoming |
| `GET /available` | Available players | Browse players who set availability |
| `GET /availability/create` | Set availability | Date, time window, course/area preference |
| `POST /availability/create` | Submit availability | Save |
| `GET /chat/:gameId` | Game chat | Real-time group chat (Socket.io) |
| `POST /ratings/create` | Submit rating | Post-game rating form submission |
| `GET /courses/:slug/review` | Write review | Course review form |
| `POST /courses/:slug/review` | Submit review | Save course review |

---

## USER FLOWS (step by step)

### Flow 1: Create a Game
1. User clicks "Create a Game" from dashboard or nav
2. Form: select course (autocomplete from DB), pick date, pick tee time, set spots (1-3), set preferences (level range, pace, transport, language), add optional note
3. Submit → game saved with status "open", appears on the open games board
4. Other players see it, click "Request to Join"
5. Creator gets notification, reviews requester's profile
6. Creator clicks "Accept" or "Decline"
7. When accepted: `game_players` entry updated to 'accepted', `spots_filled` incremented
8. When all spots filled: status changes to 'full' → game confirmed → group chat opens
9. All players get email notification with game details
10. After game date passes: status → 'completed', players prompted to rate each other

### Flow 2: Make Yourself Available
1. User clicks "I'm Available" from dashboard
2. Form: select date(s), time window (early bird/morning/afternoon/all day), preferred course or area, optional note
3. Submit → availability entry created, user appears on "Available Players" board
4. Game creators browsing available players can see them
5. Creator clicks "Invite" on a player → player gets notification
6. Player accepts → added to game as accepted player
7. Availability entry deactivated for that date

### Flow 3: Post-Game Rating
1. After game date passes, system marks game as 'completed'
2. All players get a "Rate your partners" notification/email
3. Rating form: for each partner — punctuality (1-5), pace of play (1-5), friendliness (1-5), would play again (1-5), optional comment
4. Submit → ratings saved, rated user's average_rating and total_ratings updated
5. Ratings visible on profile

---

## DESIGN / BRANDING

The visual identity should feel premium and clean, matching the French Riviera luxury positioning.

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Primary background | White/Off-white | `#FFFFFF` / `#FAFAFA` |
| Text | Dark charcoal | `#1A1A1A` |
| Accent / CTA | Deep green (golf) | `#1B5E20` |
| Secondary accent | Gold | `#B8860B` |
| Borders / Dividers | Light gray | `#E0E0E0` |
| Error | Red | `#C41E1E` |
| Success | Green | `#2E7D32` |

### Typography
- Headings: **Jost** (or Futura fallback) — clean, geometric
- Body: **Inter** or system sans-serif
- Keep it minimal and readable

### General Style
- Clean white backgrounds, generous whitespace
- Card-based layouts for games and player listings
- Subtle shadows, no heavy borders
- Course pages should feel like a premium travel guide
- Mobile-first responsive design
- Flag emojis for nationalities
- Star ratings (filled/empty stars)

---

## INITIAL COURSE DATA

Seed the database with these French Riviera courses. Fetch additional data from **GolfCourseAPI.com** (free API, sign up at golfcourseapi.com):

```json
[
    {
        "name": "Monte-Carlo Golf Club",
        "slug": "monte-carlo-golf-club",
        "city": "La Turbie",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 71,
        "architect": "Willie Park Jr",
        "year_opened": 1911,
        "latitude": 43.7475,
        "longitude": 7.3986,
        "description_en": "Perched at 900m altitude with panoramic views of Monaco and the Mediterranean. One of the oldest and most prestigious courses on the Riviera. Challenging mountain layout with stunning scenery."
    },
    {
        "name": "Royal Mougins Golf Club",
        "slug": "royal-mougins-golf-club",
        "city": "Mougins",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 71,
        "course_length_meters": 6004,
        "architect": "Robert von Hagge",
        "latitude": 43.6055,
        "longitude": 6.9775,
        "description_en": "World Top 1000 (Rolex Guide) and Top 100 Continental Europe (Golf World). Nestled in Mediterranean vegetation between rivers and hills. Members and hotel guests only."
    },
    {
        "name": "Golf Country Club Cannes-Mougins",
        "slug": "cannes-mougins-golf-country-club",
        "city": "Mougins",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 72,
        "course_length_meters": 6169,
        "architect": "Dave Thomas & Peter Allis",
        "year_opened": 1923,
        "latitude": 43.6148,
        "longitude": 6.9669,
        "description_en": "Historic course established in 1923, hosted 14 years of the Cannes Open on the European Tour. Winners include Greg Norman, Ian Woosnam, and Seve Ballesteros. Set in the beautiful Parc de Valmasque Forest."
    },
    {
        "name": "Terre Blanche — Château Course",
        "slug": "terre-blanche-chateau",
        "city": "Tourrettes",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "course_length_meters": 6616,
        "architect": "Dave Thomas",
        "latitude": 43.5989,
        "longitude": 6.7150,
        "description_en": "Prestigious championship course, GEO certified eco-responsible. Hosts the French Riviera Masters (Senior European Tour). Part of a luxury 5-star resort with spa and Albatros Golf Performance Centre."
    },
    {
        "name": "Terre Blanche — Le Riou",
        "slug": "terre-blanche-le-riou",
        "city": "Tourrettes",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "course_length_meters": 6005,
        "latitude": 43.5960,
        "longitude": 6.7120,
        "description_en": "The second course at Terre Blanche with steep fairways and a challenging layout. Reserved for club members, their guests, and hotel guests."
    },
    {
        "name": "Old Course Golf Club Mandelieu",
        "slug": "old-course-mandelieu",
        "city": "Mandelieu-La-Napoule",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 71,
        "course_length_meters": 5676,
        "year_opened": 1891,
        "architect": "Grand Duke Michel of Russia",
        "latitude": 43.5448,
        "longitude": 6.9303,
        "description_en": "One of the oldest courses in France, created in 1891 by the Grand Duke Michel of Russia. A legendary course steeped in history, absolute must-play on the Riviera."
    },
    {
        "name": "Riviera Golf de Barbossi",
        "slug": "riviera-golf-barbossi",
        "city": "Mandelieu-La-Napoule",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 72,
        "course_length_meters": 5736,
        "architect": "Robert Trent Jones Sr",
        "latitude": 43.5633,
        "longitude": 6.9274,
        "description_en": "Designed by Robert Trent Jones Sr on the heights of Cannes bay. Superb views of the Estérel massif and the Domaine's vineyards. Fairways dotted with contemporary sculptures — a unique golfing and cultural experience."
    },
    {
        "name": "Golf Opio Valbonne",
        "slug": "golf-opio-valbonne",
        "city": "Opio",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 72,
        "latitude": 43.6444,
        "longitude": 6.9833,
        "description_en": "One of the jewels of the Riviera. 18 spectacular holes through a splendid natural domain of 220 hectares between Cannes, Nice and Grasse. Rich vegetation and rolling terrain."
    },
    {
        "name": "Golf de la Grande Bastide",
        "slug": "grande-bastide",
        "city": "Châteauneuf-Grasse",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 72,
        "latitude": 43.6464,
        "longitude": 6.9700,
        "description_en": "Very popular with golfers, set in a magnificent wooded and hilly environment punctuated by seven water features. Accessible to both experienced players and beginners."
    },
    {
        "name": "Golf Club de Biot",
        "slug": "golf-club-biot",
        "city": "Biot",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 70,
        "year_opened": 1930,
        "architect": "James Peter Gannon & Percy Boomer",
        "latitude": 43.6278,
        "longitude": 7.0697,
        "description_en": "Originally called Golf de la Bastide du Roy, created in 1930 at the foot of the village of Biot, the city of glassmakers. One of the oldest courses in the region with an atypical, character-rich layout."
    },
    {
        "name": "Golf de Saint Donat",
        "slug": "golf-saint-donat",
        "city": "Grasse",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 71,
        "course_length_meters": 6031,
        "architect": "Robert Trent Jones Jr",
        "latitude": 43.6530,
        "longitude": 6.8987,
        "description_en": "Designed by Robert Trent Jones Jr through an ancient Roman road, century-old oaks and olive trees. Water features and doglegs require strategy. Gary Player inaugurated the course."
    },
    {
        "name": "Golf de Roquebrune",
        "slug": "golf-roquebrune",
        "city": "Roquebrune-sur-Argens",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "latitude": 43.4539,
        "longitude": 6.6350,
        "description_en": "Between Cannes and Saint-Tropez with spectacular views of the Maures massif. Technical 18-hole course hosting numerous competitions. 5-star hotel, spa and gourmet restaurant on site."
    },
    {
        "name": "Golf de Saint Endréol",
        "slug": "golf-saint-endreol",
        "city": "La Motte",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "course_length_meters": 5883,
        "architect": "Michel Gayon",
        "year_opened": 1992,
        "latitude": 43.5123,
        "longitude": 6.5328,
        "description_en": "Rated 14th in Top 50 French courses by Golf Européen. Picturesque backdrop of parasol pines, the River Endre, and the imposing Rocher de Roquebrune. Part of a 4-star resort."
    },
    {
        "name": "Golf de Valescure",
        "slug": "golf-valescure",
        "city": "Saint-Raphaël",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 68,
        "course_length_meters": 5061,
        "architect": "Lord Ashcomb",
        "latitude": 43.4536,
        "longitude": 6.8025,
        "description_en": "One of the oldest courses on the Côte d'Azur (100+ years old). Very short but retains all its British charm. Challenge is reaching the tiny 'postage stamp' greens."
    },
    {
        "name": "Château de Taulane",
        "slug": "chateau-de-taulane",
        "city": "La Martre",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "course_length_meters": 6300,
        "architect": "Gary Player",
        "latitude": 43.7689,
        "longitude": 6.5750,
        "description_en": "Designed by Gary Player at 1000m altitude in the heart of the Gorges du Verdon. Absolute tranquility with breathtaking mountain views and immaculate fairways. A true hidden gem."
    },
    {
        "name": "Golf de Saint-Tropez",
        "slug": "golf-saint-tropez",
        "city": "Gassin",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "architect": "Gary Player",
        "latitude": 43.2644,
        "longitude": 6.5667,
        "description_en": "Designed by Gary Player in a listed landscape with breathtaking views of Gassin, Grimaud, Ramatuelle, and Saint-Tropez. Massive 1600m² Provençal clubhouse."
    },
    {
        "name": "Nice Golf Country Club",
        "slug": "nice-golf-country-club",
        "city": "Nice",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 9,
        "par": 32,
        "latitude": 43.6997,
        "longitude": 7.2178,
        "description_en": "Located just 10 minutes from the Nice seafront. Ideal 9-hole course for beginner golfers and quick rounds. Perfect if you're short on time but want to squeeze in some golf."
    },
    {
        "name": "Golf Claux-Amic",
        "slug": "golf-claux-amic",
        "city": "Châteauneuf-Grasse",
        "department": "06",
        "department_name": "Alpes-Maritimes",
        "holes": 18,
        "par": 72,
        "latitude": 43.6550,
        "longitude": 6.9500,
        "description_en": "An enjoyable 18-hole course in the Grasse hinterland, close to four other courses making it a great area for a multi-course golf trip."
    },
    {
        "name": "Golf de Barbaroux",
        "slug": "golf-barbaroux",
        "city": "Brignoles",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 72,
        "architect": "Pete Dye & P.B. Dye",
        "latitude": 43.3894,
        "longitude": 6.0556,
        "description_en": "Designed by the legendary father-son team of Pete & P.B. Dye. A challenging championship-level course set in the Provençal countryside with excellent facilities."
    },
    {
        "name": "Estérel Latitudes Golf",
        "slug": "esterel-latitudes-golf",
        "city": "Saint-Raphaël",
        "department": "83",
        "department_name": "Var",
        "holes": 18,
        "par": 68,
        "architect": "Robert Trent Jones Sr",
        "year_opened": 1989,
        "latitude": 43.4550,
        "longitude": 6.8100,
        "description_en": "Modern course designed by Robert Trent Jones Sr, complementary to neighbouring Valescure. A great pairing for a two-course day in the Saint-Raphaël area."
    }
]
```

### Seeding Script
Create `scripts/seed-courses.js` that reads this JSON and inserts into the `courses` table. Also create `scripts/fetch-courses-api.js` that calls the GolfCourseAPI.com free API to supplement with additional data (scorecard details, GPS coordinates, etc.).

---

## ENVIRONMENT VARIABLES (.env)

```
# Server
PORT=3000
NODE_ENV=development
SESSION_SECRET=generate-a-strong-random-string-here

# Database
DATABASE_URL=postgresql://frenchrivieragolf:password@localhost:5432/frenchrivieragolf

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@frenchriviera.golf
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@frenchriviera.golf

# App
APP_URL=https://frenchriviera.golf
APP_NAME=French Riviera Golf

# GolfCourseAPI (free)
GOLF_API_KEY=your-api-key-from-golfcourseapi.com
```

---

## DEVELOPMENT PRIORITIES

Build in this order:

### Phase 1: Foundation (do this first)
1. Initialize Node.js project with Express
2. Set up PostgreSQL database and run CREATE TABLE scripts
3. Implement auth (register, login, logout, email verification)
4. Build player profile (create, edit, view, photo upload)
5. Seed course database from JSON
6. Basic landing page
7. Course directory page and individual course pages

### Phase 2: Core Matching
1. "Create a Game" form and flow
2. Open games board with filters
3. "Request to Join" / "Accept / Decline" mechanics
4. "Set Availability" form
5. Available players board
6. "Invite Player" mechanic
7. Email notifications for all actions

### Phase 3: Chat & Ratings
1. Socket.io group chat per game
2. Post-game rating system
3. Rating display on profiles
4. Game history page
5. Notification system (in-app + email)

### Phase 4: SEO & Content
1. Enrich course pages with full content
2. Add course review system
3. Blog/guide section (can be simple Markdown-rendered pages)
4. Schema.org markup on course pages
5. Sitemap.xml generation
6. Open Graph tags for social sharing

---

## IMPORTANT NOTES

- **Keep it simple.** This is an MVP. Don't over-engineer. Follow AnchorPals patterns.
- **No payment system needed** for launch. The platform is free to use.
- **Bilingual support** can be added later. Build in English first, add i18n framework in Phase 4.
- **Mobile-first** responsive design is critical — golfers will use this on their phones.
- **The course pages are the SEO engine** — they must be server-rendered, fast, and content-rich.
- **The matching/chat/rating flows are the product** — they must be smooth and reliable.
- **PostgreSQL with raw SQL queries** is fine (like AnchorPals). No need for an ORM unless preferred.
