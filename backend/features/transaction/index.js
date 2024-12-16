const express = require('express');
const { purchase } = require('./transactionController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for processing transactions and purchases
 */

/**
 * @swagger
 * /api/transaction/purchase:
 *   post:
 *     summary: Purchase tickets from the user's cart
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
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
 *                 description: List of ticket IDs to purchase
 *                 items:
 *                   type: object
 *                   properties:
 *                     ticket_id:
 *                       type: integer
 *                       description: ID of the ticket to be purchased
 *                       example: 1
 *     responses:
 *       200:
 *         description: Tickets purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart purchased successfully.
 *                 transactions:
 *                   type: array
 *                   description: List of completed transactions
 *                   items:
 *                     type: object
 *                     properties:
 *                       transaction_id:
 *                         type: integer
 *                         example: 1001
 *                       transaction_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-15T15:00:00Z"
 *                 tickets:
 *                   type: array
 *                   description: Updated ticket information
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticket_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: sold
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       purchase_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-15T15:00:00Z"
 *       400:
 *         description: Invalid cart or unavailable tickets
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
 *                   example: "The following tickets are unavailable: 101, 102"
 *       500:
 *         description: Internal server error
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
 *                   example: Failed to process cart purchase.
 */
router.post('/purchase', authenticateToken, purchase);

module.exports = router;
