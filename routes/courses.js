const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const CourseReview = require('../models/CourseReview');
const { isAuthenticated } = require('../middleware/auth');

// GET /courses - Course directory
router.get('/', async (req, res) => {
    try {
        const { department, search } = req.query;

        let courses;
        if (search) {
            courses = await Course.search(search);
        } else if (department) {
            courses = await Course.getByDepartment(department);
        } else {
            courses = await Course.getWithReviewStats();
        }

        res.render('courses/index', {
            title: 'Golf Courses on the French Riviera',
            courses,
            selectedDepartment: department || '',
            searchQuery: search || '',
            metaDescription: 'Discover 30+ golf courses on the French Riviera. From Monte-Carlo to Saint-Tropez, find the perfect course for your next round on the Côte d\'Azur.',
            canonicalPath: '/courses'
        });

    } catch (err) {
        console.error('Courses error:', err);
        req.session.error = 'Error loading courses';
        res.redirect('/');
    }
});

// GET /courses/:slug/review - Review form
router.get('/:slug/review', isAuthenticated, async (req, res) => {
    try {
        const course = await Course.findBySlug(req.params.slug);

        if (!course) {
            req.session.error = 'Course not found';
            return res.redirect('/courses');
        }

        // Check if user already reviewed
        const hasReviewed = await CourseReview.hasReviewed(course.id, req.session.user.id);
        if (hasReviewed) {
            req.session.error = 'You have already reviewed this course';
            return res.redirect(`/courses/${course.slug}`);
        }

        res.render('courses/review-form', {
            title: `Review ${course.name}`,
            course
        });

    } catch (err) {
        console.error('Review form error:', err);
        req.session.error = 'Error loading review form';
        res.redirect('/courses');
    }
});

// POST /courses/:slug/review - Submit review
router.post('/:slug/review', isAuthenticated, async (req, res) => {
    try {
        const course = await Course.findBySlug(req.params.slug);

        if (!course) {
            req.session.error = 'Course not found';
            return res.redirect('/courses');
        }

        // Check if already reviewed
        const hasReviewed = await CourseReview.hasReviewed(course.id, req.session.user.id);
        if (hasReviewed) {
            req.session.error = 'You have already reviewed this course';
            return res.redirect(`/courses/${course.slug}`);
        }

        const {
            rating, title, content, date_played,
            course_condition, value_for_money, facilities, scenery
        } = req.body;

        // Validation
        if (!rating || !content) {
            req.session.error = 'Please provide a rating and review content';
            return res.redirect(`/courses/${req.params.slug}/review`);
        }

        await CourseReview.create({
            course_id: course.id,
            user_id: req.session.user.id,
            rating: parseInt(rating),
            title: title || null,
            content,
            date_played: date_played || null,
            course_condition: course_condition ? parseInt(course_condition) : null,
            value_for_money: value_for_money ? parseInt(value_for_money) : null,
            facilities: facilities ? parseInt(facilities) : null,
            scenery: scenery ? parseInt(scenery) : null
        });

        req.session.success = 'Thank you for your review!';
        res.redirect(`/courses/${course.slug}`);

    } catch (err) {
        console.error('Submit review error:', err);
        req.session.error = 'Error submitting review';
        res.redirect('/courses');
    }
});

// GET /courses/:slug - Individual course page
router.get('/:slug', async (req, res) => {
    try {
        const course = await Course.getWithReviews(req.params.slug);

        if (!course) {
            req.session.error = 'Course not found';
            return res.redirect('/courses');
        }

        // Calculate average rating for schema
        const avgRating = course.reviews && course.reviews.length > 0
            ? (course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length).toFixed(1)
            : null;

        // Build Schema.org structured data
        const schema = {
            "@context": "https://schema.org",
            "@type": "GolfCourse",
            "name": course.name,
            "description": course.description_en || `Golf course in ${course.city}, French Riviera`,
            "url": `${process.env.APP_URL || 'https://frenchriviera.golf'}/courses/${course.slug}`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": course.city,
                "addressRegion": course.department_name,
                "addressCountry": "FR"
            }
        };

        // Add geo coordinates if available
        if (course.latitude && course.longitude) {
            schema.geo = {
                "@type": "GeoCoordinates",
                "latitude": course.latitude,
                "longitude": course.longitude
            };
        }

        // Add contact info
        if (course.phone) schema.telephone = course.phone;
        if (course.website) schema.sameAs = course.website;

        // Add aggregate rating if reviews exist
        if (avgRating && course.reviews.length > 0) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": avgRating,
                "reviewCount": course.reviews.length,
                "bestRating": "5",
                "worstRating": "1"
            };
        }

        // Add individual reviews
        if (course.reviews && course.reviews.length > 0) {
            schema.review = course.reviews.slice(0, 5).map(r => ({
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": r.display_name
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": r.rating,
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": r.content,
                "datePublished": r.created_at
            }));
        }

        // Add course details
        if (course.holes) schema.numberOfHoles = course.holes;
        if (course.year_opened) schema.foundingDate = course.year_opened.toString();

        res.render('courses/detail', {
            title: course.name,
            course,
            metaDescription: course.description_en || `Play golf at ${course.name} in ${course.city}, French Riviera. ${course.holes} holes, par ${course.par}.`,
            canonicalPath: `/courses/${course.slug}`,
            ogType: 'place',
            schema
        });

    } catch (err) {
        console.error('Course detail error:', err);
        req.session.error = 'Error loading course';
        res.redirect('/courses');
    }
});

module.exports = router;
