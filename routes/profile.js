const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { isAuthenticated } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// GET /profile - View own profile
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('profile/view', {
            title: 'My Profile',
            profile: user,
            isOwnProfile: true
        });
    } catch (err) {
        console.error('Profile error:', err);
        req.session.error = 'Error loading profile';
        res.redirect('/dashboard');
    }
});

// GET /profile/edit - Edit profile form
router.get('/edit', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        const courses = await Course.findAll();

        res.render('profile/edit', {
            title: 'Edit Profile',
            profile: user,
            courses
        });
    } catch (err) {
        console.error('Profile edit error:', err);
        req.session.error = 'Error loading profile';
        res.redirect('/profile');
    }
});

// POST /profile/edit - Update profile
router.post('/edit', isAuthenticated, async (req, res) => {
    try {
        const {
            display_name, nationality, languages, bio,
            location_type, location_city, visiting_from, visiting_until, phone,
            handicap, handicap_type, playing_level, pace_preference,
            transport_preference, typical_tee_time, usual_days,
            vibe, group_preference, post_round
        } = req.body;

        // Process languages array
        const languagesArray = languages ?
            (Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim()).filter(Boolean)) :
            null;

        const profileData = {
            display_name: display_name || undefined,
            nationality: nationality || null,
            languages: languagesArray,
            bio: bio || null,
            location_type: location_type || null,
            location_city: location_city || null,
            visiting_from: visiting_from || null,
            visiting_until: visiting_until || null,
            phone: phone || null,
            handicap: handicap ? parseFloat(handicap) : null,
            handicap_type: handicap_type || null,
            playing_level: playing_level || null,
            pace_preference: pace_preference || null,
            transport_preference: transport_preference || null,
            typical_tee_time: typical_tee_time || null,
            usual_days: usual_days || null,
            vibe: vibe || null,
            group_preference: group_preference || null,
            post_round: post_round || null
        };

        await User.updateProfile(req.session.user.id, profileData);

        // Update session display name if changed
        if (display_name) {
            req.session.user.display_name = display_name;
        }

        req.session.success = 'Profile updated successfully';
        res.redirect('/profile');

    } catch (err) {
        console.error('Profile update error:', err);
        req.session.error = 'Error updating profile';
        res.redirect('/profile/edit');
    }
});

// POST /profile/photo - Upload profile photo
router.post('/photo', isAuthenticated, uploadProfile.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            req.session.error = 'Please select an image to upload';
            return res.redirect('/profile/edit');
        }

        const photoPath = `/uploads/profiles/${req.file.filename}`;

        // Delete old photo if exists
        const user = await User.findById(req.session.user.id);
        if (user.profile_photo) {
            const oldPath = path.join(__dirname, '../public', user.profile_photo);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await User.updatePhoto(req.session.user.id, photoPath);

        // Update session
        req.session.user.profile_photo = photoPath;

        req.session.success = 'Profile photo updated';
        res.redirect('/profile/edit');

    } catch (err) {
        console.error('Photo upload error:', err);
        req.session.error = 'Error uploading photo';
        res.redirect('/profile/edit');
    }
});

// GET /profile/:id - View another user's profile
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const profile = await User.getPublicProfile(userId);

        if (!profile) {
            req.session.error = 'Profile not found';
            return res.redirect('/');
        }

        const isOwnProfile = req.session.user && req.session.user.id === userId;

        res.render('profile/view', {
            title: profile.display_name,
            profile,
            isOwnProfile
        });

    } catch (err) {
        console.error('Profile view error:', err);
        req.session.error = 'Error loading profile';
        res.redirect('/');
    }
});

module.exports = router;
