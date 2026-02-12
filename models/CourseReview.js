const db = require('../config/database');

const CourseReview = {
    // Create a new review
    async create(data) {
        const {
            course_id, user_id, rating, title, content,
            date_played, course_condition, value_for_money, facilities, scenery
        } = data;

        const result = await db.query(
            `INSERT INTO course_reviews (
                course_id, user_id, rating, title, content,
                date_played, course_condition, value_for_money, facilities, scenery,
                approved
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
            RETURNING *`,
            [
                course_id, user_id, rating, title, content,
                date_played || null, course_condition || null,
                value_for_money || null, facilities || null, scenery || null
            ]
        );

        return result.rows[0];
    },

    // Get reviews by course
    async getByCourse(courseId) {
        const result = await db.query(
            `SELECT cr.*, u.display_name, u.profile_photo
             FROM course_reviews cr
             JOIN users u ON cr.user_id = u.id
             WHERE cr.course_id = $1 AND cr.approved = true
             ORDER BY cr.created_at DESC`,
            [courseId]
        );
        return result.rows;
    },

    // Get reviews by user
    async getByUser(userId) {
        const result = await db.query(
            `SELECT cr.*, c.name as course_name, c.slug as course_slug
             FROM course_reviews cr
             JOIN courses c ON cr.course_id = c.id
             WHERE cr.user_id = $1
             ORDER BY cr.created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    // Check if user already reviewed a course
    async hasReviewed(courseId, userId) {
        const result = await db.query(
            'SELECT id FROM course_reviews WHERE course_id = $1 AND user_id = $2',
            [courseId, userId]
        );
        return result.rows.length > 0;
    },

    // Get review by ID
    async findById(id) {
        const result = await db.query(
            `SELECT cr.*, c.name as course_name, c.slug as course_slug
             FROM course_reviews cr
             JOIN courses c ON cr.course_id = c.id
             WHERE cr.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    // Update review
    async update(id, userId, data) {
        const {
            rating, title, content, date_played,
            course_condition, value_for_money, facilities, scenery
        } = data;

        const result = await db.query(
            `UPDATE course_reviews
             SET rating = $1, title = $2, content = $3, date_played = $4,
                 course_condition = $5, value_for_money = $6, facilities = $7, scenery = $8
             WHERE id = $9 AND user_id = $10
             RETURNING *`,
            [
                rating, title, content, date_played || null,
                course_condition || null, value_for_money || null,
                facilities || null, scenery || null,
                id, userId
            ]
        );
        return result.rows[0];
    },

    // Delete review
    async delete(id, userId) {
        await db.query(
            'DELETE FROM course_reviews WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
    },

    // Get average ratings for a course
    async getAverageRatings(courseId) {
        const result = await db.query(
            `SELECT
                AVG(rating) as overall,
                AVG(course_condition) as condition,
                AVG(value_for_money) as value,
                AVG(facilities) as facilities,
                AVG(scenery) as scenery,
                COUNT(*) as total
             FROM course_reviews
             WHERE course_id = $1 AND approved = true`,
            [courseId]
        );
        return result.rows[0];
    }
};

module.exports = CourseReview;
