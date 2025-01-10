const express = require('express');
const {
  createEvent,
  getCategories,
  getEvents,
  getEvent,
  getOrganizerEvents,
  editEvent,
  getEventReport,
  buyTicket,
  createEventWithTickets,
  deleteEvent,
  getEventStatus,
} = require('./eventController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, createEvent);

router.get('/', getEvents);

router.get('/categories', getCategories);

router.get(`/:organizerId`, authenticateToken, getOrganizerEvents);

router.put('/edit/:eventId', authenticateToken, editEvent);

router.get('/report/:eventId', authenticateToken, getEventReport);

router.post('/:eventId/buy', authenticateToken, buyTicket);

router.post('/tickets', authenticateToken, createEventWithTickets);

router.get('/get/:event_id', getEvent);

router.post('/:eventId/delete', authenticateToken, deleteEvent);

router.get('/status/:eventId', authenticateToken, getEventStatus);

module.exports = router;
