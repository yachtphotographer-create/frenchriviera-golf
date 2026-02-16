const db = require('../config/database');

const Course = {
    // Get all active courses
    async findAll(options = {}) {
        let query = 'SELECT * FROM courses WHERE active = true';
        const params = [];
        let paramIndex = 1;

        if (options.department) {
            query += ` AND department = $${paramIndex}`;
            params.push(options.department);
            paramIndex++;
        }

        if (options.featured) {
            query += ' AND featured = true';
        }

        query += ' ORDER BY name';

        if (options.limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(options.limit);
        }

        const result = await db.query(query, params);
        return result.rows;
    },

    // Find course by ID
    async findById(id) {
        const result = await db.query(
            'SELECT * FROM courses WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    // Find course by slug
    async findBySlug(slug) {
        const result = await db.query(
            'SELECT * FROM courses WHERE slug = $1 AND active = true',
            [slug]
        );
        return result.rows[0];
    },

    // Get featured courses
    async getFeatured(limit = 6) {
        const result = await db.query(
            'SELECT * FROM courses WHERE featured = true AND active = true ORDER BY name LIMIT $1',
            [limit]
        );
        return result.rows;
    },

    // Get courses by department
    async getByDepartment(department) {
        const result = await db.query(
            'SELECT * FROM courses WHERE department = $1 AND active = true ORDER BY name',
            [department]
        );
        return result.rows;
    },

    // Search courses
    async search(query) {
        const result = await db.query(
            `SELECT * FROM courses
             WHERE active = true AND (
                 name ILIKE $1 OR
                 city ILIKE $1 OR
                 description_en ILIKE $1 OR
                 description_fr ILIKE $1
             )
             ORDER BY name`,
            [`%${query}%`]
        );
        return result.rows;
    },

    // Get courses with review stats
    async getWithReviewStats() {
        const result = await db.query(
            `SELECT c.*,
                    COALESCE(AVG(cr.rating), 0) as avg_rating,
                    COUNT(cr.id) as review_count
             FROM courses c
             LEFT JOIN course_reviews cr ON c.id = cr.course_id AND cr.approved = true
             WHERE c.active = true
             GROUP BY c.id
             ORDER BY c.name`
        );
        return result.rows;
    },

    // Get course with its reviews
    async getWithReviews(slug) {
        const course = await this.findBySlug(slug);
        if (!course) return null;

        const reviews = await db.query(
            `SELECT cr.*, u.display_name, u.profile_photo
             FROM course_reviews cr
             JOIN users u ON cr.user_id = u.id
             WHERE cr.course_id = $1 AND cr.approved = true
             ORDER BY cr.created_at DESC`,
            [course.id]
        );

        return {
            ...course,
            reviews: reviews.rows
        };
    },

    // Insert course (for seeding)
    async create(courseData) {
        const columns = Object.keys(courseData);
        const values = Object.values(courseData);
        const placeholders = columns.map((_, i) => `$${i + 1}`);

        const result = await db.query(
            `INSERT INTO courses (${columns.join(', ')})
             VALUES (${placeholders.join(', ')})
             ON CONFLICT (slug) DO UPDATE SET
             ${columns.map((col, i) => `${col} = $${i + 1}`).join(', ')},
             updated_at = NOW()
             RETURNING *`,
            values
        );
        return result.rows[0];
    },

    // Get courses by city names (for city landing pages)
    async getByCities(cities) {
        const placeholders = cities.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db.query(
            `SELECT c.id, c.name, c.slug, c.city, c.department, c.department_name,
                    c.holes, c.par, c.course_length_meters, c.architect, c.year_opened,
                    c.latitude, c.longitude, c.description_en, c.photos, c.featured,
                    COALESCE(AVG(cr.rating), 0) as avg_rating,
                    COUNT(cr.id) as review_count
             FROM courses c
             LEFT JOIN course_reviews cr ON c.id = cr.course_id AND cr.approved = true
             WHERE c.active = true AND c.city IN (${placeholders})
             GROUP BY c.id, c.name, c.slug, c.city, c.department, c.department_name,
                      c.holes, c.par, c.course_length_meters, c.architect, c.year_opened,
                      c.latitude, c.longitude, c.description_en, c.photos, c.featured
             ORDER BY c.name`,
            cities
        );
        return result.rows;
    },

    // Get nearby courses (basic version without PostGIS)
    async getNearby(lat, lng, radiusKm = 30, limit = 10) {
        // Haversine formula approximation
        const result = await db.query(
            `SELECT *,
                    (6371 * acos(cos(radians($1)) * cos(radians(latitude))
                    * cos(radians(longitude) - radians($2)) + sin(radians($1))
                    * sin(radians(latitude)))) AS distance
             FROM courses
             WHERE active = true AND latitude IS NOT NULL AND longitude IS NOT NULL
             HAVING distance < $3
             ORDER BY distance
             LIMIT $4`,
            [lat, lng, radiusKm, limit]
        );
        return result.rows;
    }
};

module.exports = Course;
