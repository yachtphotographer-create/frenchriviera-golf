require('dotenv').config({ quiet: true });
const { pool } = require('../config/database');

const createTables = async () => {
    const client = await pool.connect();

    try {
        console.log('Creating database tables...');

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
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
                languages TEXT[],
                bio TEXT,
                location_type VARCHAR(20) CHECK (location_type IN ('resident', 'visitor', 'seasonal')),
                location_city VARCHAR(100),
                visiting_from DATE,
                visiting_until DATE,
                phone VARCHAR(50),
                phone_verified BOOLEAN DEFAULT FALSE,

                -- Golf Details
                handicap DECIMAL(4,1),
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

                -- Stats
                games_played INTEGER DEFAULT 0,
                average_rating DECIMAL(3,2) DEFAULT 0,
                total_ratings INTEGER DEFAULT 0,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                last_login TIMESTAMPTZ
            )
        `);
        console.log('  - users table created');

        // Courses table
        await client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                slug VARCHAR(200) UNIQUE NOT NULL,
                city VARCHAR(100),
                department VARCHAR(5),
                department_name VARCHAR(50),
                address TEXT,
                phone VARCHAR(50),
                website VARCHAR(300),
                email VARCHAR(255),

                -- Course Details
                holes INTEGER,
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

                -- Facilities
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

                -- Content
                description_en TEXT,
                description_fr TEXT,
                signature_holes TEXT,
                insider_tips TEXT,
                green_fee_info TEXT,
                dress_code TEXT,
                booking_info TEXT,
                photos TEXT[],

                -- Meta
                featured BOOLEAN DEFAULT FALSE,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - courses table created');

        // User courses (many-to-many)
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_courses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                relationship VARCHAR(20) CHECK (relationship IN ('home_course', 'played', 'wishlist')),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, course_id, relationship)
            )
        `);
        console.log('  - user_courses table created');

        // Games table
        await client.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id),

                game_date DATE NOT NULL,
                tee_time TIME NOT NULL,

                spots_total INTEGER CHECK (spots_total BETWEEN 1 AND 3),
                spots_filled INTEGER DEFAULT 0,

                level_min VARCHAR(20),
                level_max VARCHAR(20),
                pace_preference VARCHAR(20),
                transport_preference VARCHAR(20),
                language_preference TEXT[],

                note TEXT,

                status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'confirmed', 'completed', 'cancelled')),

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - games table created');

        // Game players table
        await client.query(`
            CREATE TABLE IF NOT EXISTS game_players (
                id SERIAL PRIMARY KEY,
                game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                role VARCHAR(20) CHECK (role IN ('creator', 'player')),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
                invited_by INTEGER REFERENCES users(id),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(game_id, user_id)
            )
        `);
        console.log('  - game_players table created');

        // Availability table
        await client.query(`
            CREATE TABLE IF NOT EXISTS availability (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                available_date DATE NOT NULL,
                time_window VARCHAR(20) CHECK (time_window IN ('early_bird', 'morning', 'afternoon', 'all_day')),
                course_id INTEGER REFERENCES courses(id),
                area VARCHAR(50),
                note TEXT,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - availability table created');

        // Messages table
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
                sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - messages table created');

        // Ratings table
        await client.query(`
            CREATE TABLE IF NOT EXISTS ratings (
                id SERIAL PRIMARY KEY,
                game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
                rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                rated_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

                punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
                pace_of_play INTEGER CHECK (pace_of_play BETWEEN 1 AND 5),
                friendliness INTEGER CHECK (friendliness BETWEEN 1 AND 5),
                would_play_again INTEGER CHECK (would_play_again BETWEEN 1 AND 5),

                overall DECIMAL(3,2),
                comment TEXT,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(game_id, rater_id, rated_id)
            )
        `);
        console.log('  - ratings table created');

        // Course reviews table
        await client.query(`
            CREATE TABLE IF NOT EXISTS course_reviews (
                id SERIAL PRIMARY KEY,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

                rating INTEGER CHECK (rating BETWEEN 1 AND 5),
                title VARCHAR(200),
                content TEXT,
                date_played DATE,

                course_condition INTEGER CHECK (course_condition BETWEEN 1 AND 5),
                value_for_money INTEGER CHECK (value_for_money BETWEEN 1 AND 5),
                facilities INTEGER CHECK (facilities BETWEEN 1 AND 5),
                scenery INTEGER CHECK (scenery BETWEEN 1 AND 5),

                approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - course_reviews table created');

        // Notifications table
        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(200),
                message TEXT,
                link VARCHAR(500),
                read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log('  - notifications table created');

        // Create indexes
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
            CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
            CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
            CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
            CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(available_date);
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
        `);
        console.log('  - indexes created');

        console.log('\nAll tables created successfully!');

    } catch (err) {
        console.error('Error creating tables:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
};

createTables().catch(console.error);
