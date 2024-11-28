const express = require('express');
const { createEvent, getCategories, getEvents, getEventsByCategory } = require('./eventController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', createEvent, authenticateToken);
router.get('/', getEvents);
router.get('/categories', getCategories);
router.get('/category/:category', getEventsByCategory);

module.exports = router;
