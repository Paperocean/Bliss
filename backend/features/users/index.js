const express = require('express');
const { getUserProfile, fetchUserTickets } = require('./userController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/tickets', authenticateToken, fetchUserTickets);

module.exports = router;
