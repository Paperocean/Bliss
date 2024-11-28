const express = require('express');
const { calculateSummary } = require('./cartController');

const router = express.Router();

router.post('/calculateSummary', calculateSummary);

module.exports = router;
