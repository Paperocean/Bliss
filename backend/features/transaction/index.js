const express = require('express');
const { purchase } = require('./transactionController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/purchase', authenticateToken, purchase);

module.exports = router;
