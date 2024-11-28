const express = require('express');
const { getAvailableSeats, fetchEventByTicket } = require('./ticketController');

const router = express.Router();

router.get('/available/:eventId', getAvailableSeats);
router.get('/:ticketId/event', fetchEventByTicket);

module.exports = router;
