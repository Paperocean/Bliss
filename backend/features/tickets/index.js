const express = require('express');
const { getAvailableSeats, getEventByTicket } = require('./ticketController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API for managing tickets and related operations
 */

/**
 * @swagger
 * /api/tickets/available/{eventId}:
 *   get:
 *     summary: Get available seats for a specific event
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID of the event to fetch available seats
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of available seats for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 seats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticket_id:
 *                         type: integer
 *                         example: 101
 *                       seat_label:
 *                         type: string
 *                         example: "A12"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/available/:eventId', getAvailableSeats);

/**
 * @swagger
 * /api/tickets/{ticketId}/event:
 *   get:
 *     summary: Get event details by ticket ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         description: ID of the ticket to get event details
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 event:
 *                   type: object
 *                   properties:
 *                     event_id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Classical Music Night
 *                     description:
 *                       type: string
 *                       example: A wonderful evening of classical music.
 *                     location:
 *                       type: string
 *                       example: Philharmonic Hall
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-20T18:00:00Z"
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-20T21:00:00Z"
 *                     seat_label:
 *                       type: string
 *                       example: "A12"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 200.00
 *       404:
 *         description: Ticket not found or no associated event
 *       500:
 *         description: Internal server error
 */
router.get('/:ticketId/event', getEventByTicket);

module.exports = router;
