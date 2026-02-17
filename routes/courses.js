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

        // Breadcrumbs
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.APP_URL || 'https://frenchriviera.golf'
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Golf Courses"
            }
        ];

        // ItemList schema for course directory
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Golf Courses on the French Riviera",
            "description": "Complete directory of golf courses on the Côte d'Azur",
            "numberOfItems": courses.length,
            "itemListElement": courses.slice(0, 10).map((course, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "GolfCourse",
                    "name": course.name,
                    "url": (process.env.APP_URL || 'https://frenchriviera.golf') + '/courses/' + course.slug,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": course.city,
                        "addressRegion": course.department_name,
                        "addressCountry": "FR"
                    }
                }
            }))
        };

        res.render('courses/index', {
            title: 'Golf Courses on the French Riviera',
            courses,
            selectedDepartment: department || '',
            searchQuery: search || '',
            metaDescription: `Discover ${courses.length} golf courses on the French Riviera. From Monte-Carlo to Saint-Tropez, find the perfect course for your next round on the Côte d'Azur. Compare facilities, read reviews, book tee times.`,
            canonicalPath: '/courses',
            keywords: 'golf courses french riviera, golf cote d azur, best golf courses monaco, cannes golf, nice golf courses, saint tropez golf, golf holidays france',
            breadcrumbs,
            schema: itemListSchema
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

        // Set localized description based on language preference
        const lang = req.lang || 'en';
        course.description = (lang === 'fr' && course.description_fr)
            ? course.description_fr
            : (course.description_en || '');

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
        if (course.photos && course.photos.length > 0) {
            // Handle both absolute URLs (http...) and relative paths
            const baseUrl = process.env.APP_URL || 'https://frenchriviera.golf';
            schema.image = course.photos.map(p => p.startsWith('http') ? p : baseUrl + p);
        }

        // Add PriceSpecification schema for green fees (SEO for pricing)
        if (course.green_fee_info) {
            // Extract price range from green_fee_info text (e.g., "€80-140")
            const priceMatch = course.green_fee_info.match(/€(\d+)(?:-(\d+))?/);
            if (priceMatch) {
                const minPrice = priceMatch[1];
                const maxPrice = priceMatch[2] || priceMatch[1];
                schema.priceRange = `€${minPrice}-€${maxPrice}`;
                schema.offers = {
                    "@type": "Offer",
                    "name": "Green Fee",
                    "description": course.green_fee_info,
                    "priceCurrency": "EUR",
                    "price": minPrice,
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": minPrice,
                        "maxPrice": maxPrice,
                        "priceCurrency": "EUR"
                    },
                    "availability": "https://schema.org/InStock",
                    "validFrom": new Date().toISOString().split('T')[0]
                };
            }
        }

        // Add FAQ Schema for rich snippets
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `How many holes does ${course.name} have?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${course.name} is a ${course.holes}-hole golf course with a par of ${course.par}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Where is ${course.name} located?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `${course.name} is located in ${course.city}, ${course.department_name}, on the French Riviera.${course.address ? ' The full address is: ' + course.address : ''}`
                    }
                },
                {
                    "@type": "Question",
                    "name": `How can I book a tee time at ${course.name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `You can book a tee time at ${course.name} by ${course.phone ? 'calling ' + course.phone : 'contacting the club directly'}${course.website ? ' or visiting their website at ' + course.website : ''}.`
                    }
                }
            ]
        };

        // Combine schemas into array
        const combinedSchema = [schema, faqSchema];

        // Breadcrumbs for SEO
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": process.env.APP_URL || 'https://frenchriviera.golf'
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Golf Courses",
                "item": (process.env.APP_URL || 'https://frenchriviera.golf') + '/courses'
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": course.department_name,
                "item": (process.env.APP_URL || 'https://frenchriviera.golf') + '/courses?department=' + course.department
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": course.name
            }
        ];

        // SEO keywords specific to this course
        const keywords = `${course.name}, golf ${course.city}, golf ${course.department_name}, ${course.holes} hole golf course france, golf french riviera, tee time ${course.city}, green fee ${course.city}`;

        // Get related courses for internal linking
        const relatedCourses = await Course.getRelated(course.id, course.department, 4);

        // Default OG image for courses without photos
        const appUrl = process.env.APP_URL || 'https://frenchriviera.golf';
        const defaultOgImage = appUrl + '/images/og-default.png';
        let courseOgImage = defaultOgImage;
        if (course.photos && course.photos.length > 0) {
            // Check if photo URL is already absolute (starts with http)
            const photoUrl = course.photos[0];
            courseOgImage = photoUrl.startsWith('http') ? photoUrl : appUrl + photoUrl;
        }

        res.render('courses/detail', {
            title: course.name,
            course,
            relatedCourses,
            metaDescription: course.description_en || `Play golf at ${course.name} in ${course.city}, French Riviera. ${course.holes} holes, par ${course.par}. Book tee times, find playing partners, read reviews.`,
            canonicalPath: `/courses/${course.slug}`,
            ogType: 'place',
            ogImage: courseOgImage,
            keywords,
            breadcrumbs,
            schema: combinedSchema
        });

    } catch (err) {
        console.error('Course detail error:', err);
        req.session.error = 'Error loading course';
        res.redirect('/courses');
    }
});

module.exports = router;
