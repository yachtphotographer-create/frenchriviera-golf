const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Course = require('../models/Course');
const Game = require('../models/Game');
const { isAuthenticated } = require('../middleware/auth');
const { requireLaunched } = require('../utils/launch');

// GET /available - Browse available players
router.get('/', async (req, res) => {
    try {
        const { date, area, course, time_window } = req.query;

        const filters = {
            exclude_user: req.session.user?.id
        };
        if (date) filters.date = date;
        if (area) filters.area = area;
        if (course) filters.course_id = parseInt(course);
        if (time_window) filters.time_window = time_window;

        const availablePlayers = await Availability.findActive(filters);
        const courses = await Course.findAll();

        // Get current user's open games for inviting
        let myOpenGames = [];
        if (req.session.user) {
            myOpenGames = await Game.findByCreator(req.session.user.id, 'open');
            console.log(`User ${req.session.user.display_name} has ${myOpenGames.length} open games:`, myOpenGames.map(g => g.id));
        }

        res.render('availability/index', {
            title: 'Available Players',
            availablePlayers,
            courses,
            filters: { date, area, course, time_window },
            myOpenGames
        });

    } catch (err) {
        console.error('Available players error:', err);
        req.session.error = 'Error loading available players';
        res.redirect('/');
    }
});

// GET /availability/create - Set availability form
router.get('/create', isAuthenticated, requireLaunched, async (req, res) => {
    try {
        const courses = await Course.findAll();
        const myAvailability = await Availability.findByUser(req.session.user.id);

        res.render('availability/create', {
            title: 'Set Your Availability',
            courses,
            myAvailability
        });

    } catch (err) {
        console.error('Availability form error:', err);
        req.session.error = 'Error loading form';
        res.redirect('/dashboard');
    }
});

// POST /availability/create - Submit availability
router.post('/create', isAuthenticated, requireLaunched, async (req, res) => {
    try {
        const { date_type, available_date, start_date, end_date, time_window, course_ids, area, note } = req.body;

        if (!time_window) {
            req.session.error = 'Please select a time window';
            return res.redirect('/availability/create');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get list of dates to create availability for
        let dates = [];

        if (date_type === 'range' && start_date && end_date) {
            // Create entries for each day in the range
            const start = new Date(start_date);
            const end = new Date(end_date);

            if (start < today) {
                req.session.error = 'Start date must be in the future';
                return res.redirect('/availability/create');
            }

            if (end < start) {
                req.session.error = 'End date must be after start date';
                return res.redirect('/availability/create');
            }

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dates.push(d.toISOString().split('T')[0]);
            }
        } else if (available_date) {
            // Single date
            const selectedDate = new Date(available_date);
            if (selectedDate < today) {
                req.session.error = 'Please select a future date';
                return res.redirect('/availability/create');
            }
            dates.push(available_date);
        } else {
            req.session.error = 'Please select a date';
            return res.redirect('/availability/create');
        }

        // Handle multiple courses (can be string or array)
        let courseIdList = [];
        if (course_ids) {
            const ids = Array.isArray(course_ids) ? course_ids : [course_ids];
            // Filter out empty strings and parse valid IDs
            courseIdList = ids.filter(id => id && id !== '').map(id => parseInt(id)).filter(id => !isNaN(id));
        }

        // Create availability entries
        let createdCount = 0;
        for (const date of dates) {
            if (courseIdList.length > 0) {
                // Create one entry per course
                for (const courseId of courseIdList) {
                    await Availability.create({
                        user_id: req.session.user.id,
                        available_date: date,
                        time_window,
                        course_id: courseId,
                        area: area || null,
                        note: note || null
                    });
                    createdCount++;
                }
            } else {
                // No specific course
                await Availability.create({
                    user_id: req.session.user.id,
                    available_date: date,
                    time_window,
                    course_id: null,
                    area: area || null,
                    note: note || null
                });
                createdCount++;
            }
        }

        req.session.success = `Availability set for ${dates.length} day${dates.length > 1 ? 's' : ''}! You will appear on the available players board.`;
        res.redirect('/availability/create');

    } catch (err) {
        console.error('Set availability error:', err);
        req.session.error = 'Error setting availability';
        res.redirect('/availability/create');
    }
});

// POST /availability/:id/delete - Delete availability
router.post('/:id/delete', isAuthenticated, async (req, res) => {
    try {
        const availabilityId = parseInt(req.params.id);
        await Availability.delete(availabilityId, req.session.user.id);

        req.session.success = 'Availability removed';
        res.redirect('/availability/create');

    } catch (err) {
        console.error('Delete availability error:', err);
        req.session.error = 'Error removing availability';
        res.redirect('/availability/create');
    }
});

module.exports = router;
