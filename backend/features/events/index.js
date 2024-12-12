const express = require('express');
const { createEvent, getCategories, getEvents } = require('./eventController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for event-related operations
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - start_time
 *               - end_time
 *               - category_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mahoniowy Jazz
 *               description:
 *                 type: string
 *                 example: Noc pełna jazzowej muzyki!
 *               location:
 *                 type: string
 *                 example: Wrocław, Hala Stulecia
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-15T18:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-15T21:00:00Z"
 *               capacity:
 *                 type: integer
 *                 example: 200
 *               category_id:
 *                 type: integer
 *                 example: 3
 *               rows:
 *                 type: integer
 *                 example: 10
 *               seats_per_row:
 *                 type: integer
 *                 example: 20
 *               has_numbered_seats:
 *                 type: boolean
 *                 example: false
 *               ticket_price:
 *                 type: number
 *                 format: float
 *                 example: 50.0
 *               seat_prices:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *                 example: { "A1": 60.0, "A2": 60.0 }
 *     responses:
 *       201:
 *         description: Event created successfully
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
 *                       example: Mahoniowy Jazz
 *       400:
 *         description: Invalid input or missing required fields
 *       500:
 *         description: Server error while creating event
 */

router.post('/', authenticateToken, createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Mahoniowy Jazz
 *                       description:
 *                         type: string
 *                         example: Noc pełna jazzowej muzyki!
 *                       location:
 *                         type: string
 *                         example: Wrocław, Hala stulecia
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-11T19:00:00Z"
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-11T22:00:00Z"
 *                       category:
 *                         type: string
 *                         example: Music
 *                       available_tickets:
 *                         type: integer
 *                         example: 100
 *       500:
 *         description: Server error while fetching events
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/events/categories:
 *   get:
 *     summary: Retrieve all event categories
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Music
 *       500:
 *         description: Server error while fetching categories
 */
router.get('/categories', getCategories);

module.exports = router;
