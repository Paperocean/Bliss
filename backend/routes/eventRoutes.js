const express = require('express');
const { createEvent, getCategories } = require('../controllers/eventController');
const router = express.Router();

router.post('/events', createEvent);
router.get('/events', getCategories);

module.exports = router;