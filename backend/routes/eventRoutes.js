const express = require('express');
const { createEvent } = require('../controllers/eventController');
const router = express.Router();

router.post('/events', createEvent);
router.post('/categories', getCategories);

module.exports = router;