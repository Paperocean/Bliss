const express = require('express');
const { createEvent, getCategories, getEvents } = require('./eventController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', createEvent, authenticateToken);
router.get('/', getEvents);
router.get('/categories', getCategories);

module.exports = router;
