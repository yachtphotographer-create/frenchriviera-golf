const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const Course = require('../models/Course');
const { isAuthenticated } = require('../middleware/auth');

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

        res.render('availability/index', {
            title: 'Available Players',
            availablePlayers,
            courses,
            filters: { date, area, course, time_window }
        });

    } catch (err) {
        console.error('Available players error:', err);
        req.session.error = 'Error loading available players';
        res.redirect('/');
    }
});

// GET /availability/create - Set availability form
router.get('/create', isAuthenticated, async (req, res) => {
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
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { available_date, time_window, course_id, area, note } = req.body;

        if (!available_date || !time_window) {
            req.session.error = 'Please select a date and time window';
            return res.redirect('/availability/create');
        }

        // Check if date is in the future
        const selectedDate = new Date(available_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            req.session.error = 'Please select a future date';
            return res.redirect('/availability/create');
        }

        await Availability.create({
            user_id: req.session.user.id,
            available_date,
            time_window,
            course_id: course_id ? parseInt(course_id) : null,
            area: area || null,
            note: note || null
        });

        req.session.success = 'Availability set! You will appear on the available players board.';
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
