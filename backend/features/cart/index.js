const express = require('express');
const authenticateToken = require('../../middleware/authMiddleware');
const { checkout } = require('./cartController');

const router = express.Router();

router.post('/checkout', authenticateToken, checkout);

module.exports = router;
