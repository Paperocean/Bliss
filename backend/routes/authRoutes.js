const express = require('express');
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../config/db');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching profile for user ID:', userId);

        const user = await pool.query('SELECT * FROM public.users WHERE id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user: user.rows[0] });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

module.exports = router;
