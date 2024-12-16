const express = require('express');
const { calculateCart } = require('./cartController');

const router = express.Router();

/**
 * @swagger
 * /api/cart/calculate:
 *   post:
 *     summary: Calculate the total price of tickets in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cart
 *             properties:
 *               cart:
 *                 type: array
 *                 description: List of tickets in the cart
 *                 items:
 *                   type: object
 *                   properties:
 *                     ticket_id:
 *                       type: integer
 *                       description: ID of the ticket to be calculated
 *                       example: 101
 *     responses:
 *       200:
 *         description: Cart calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalPrice:
 *                   type: number
 *                   format: float
 *                   example: 300.50
 *                 tickets:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       ticket_id:
 *                         type: integer
 *                         example: 101
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       status:
 *                         type: string
 *                         example: available
 *                       title:
 *                         type: string
 *                         example: Mahoniowy Jazz
 *                       seat_label:
 *                         type: string
 *                         example: "A12"
 *       400:
 *         description: Invalid cart data or unavailable tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "The following tickets are invalid or unavailable: 102, 103"
 *       500:
 *         description: Internal server error while calculating the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while calculating the cart."
 */

router.post('/calculate', calculateCart);

module.exports = router;
