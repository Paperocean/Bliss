const express = require('express');
const { createEvent, getCategories, getEventsByCategory } = require('../controllers/eventController');
const router = express.Router();

router.post('/events', createEvent);
router.get('/events', getCategories);
router.get('/events/category/:category', getEventsByCategory);

module.exports = router;