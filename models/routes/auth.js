// routes/auth.js

const express = require('express');
const router = express.Router(); 
const { body, validationResult } = require('express-validator'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// @route   POST /api/auth/signup
// @desc    नया यूजर रजिस्टर करें
// @access  Public
router.post(
    '/signup', 
    [
        // इनपुट वैलिडेशन
        body('username', 'यूजरनेम ज़रूरी है').not().isEmpty(),
        body('email', 'कृपया सही ईमेल डालें').isEmail(),
        body('password', 'पासवर्ड 6 या अधिक अक्षर का होना चाहिए').isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // 1. ईमेल चेक करें
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'यह ईमेल पहले से इस्तेमाल हो रहा है।' });
            }

            // 2. नया यूजर ऑब्जेक्ट बनाएं
            user = new User({ username, email, password });

            // 3. पासवर्ड को सुरक्षित करें (Hash)
            const salt = await bcrypt.genGenSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // 4. डेटाबेस में सेव करें
            await user.save();

            // 5. JSON Web Token (JWT) वापस भेजें
            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                'mysecrettoken', // यह आपका Secret Key है
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({ token, message: 'सफलतापूर्वक अकाउंट बन गया!' });
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
