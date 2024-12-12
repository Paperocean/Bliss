const express = require('express');
const {
  getUserProfile,
  getUserTickets,
  changePassword,
} = require('./userController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for user-related operations
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 42
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-01T14:30:00Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-01T14:30:00Z"
 *       404:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Server error
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
 *                   example: Server error while getting users profile.
 */
router.get('/profile', authenticateToken, getUserProfile);

/**
 * @swagger
 * /api/user/tickets:
 *   get:
 *     summary: Get all tickets purchased by the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets purchased by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticket_id:
 *                         type: integer
 *                         example: 101
 *                       event_id:
 *                         type: integer
 *                         example: 201
 *                       user_id:
 *                         type: integer
 *                         example: 42
 *                       purchase_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-01T14:30:00Z"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       status:
 *                         type: string
 *                         example: sold
 *                       seat_label:
 *                         type: string
 *                         example: "A12"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-01T14:30:00Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-01T14:30:00Z"
 *       500:
 *         description: Server error while fetching tickets
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
 *                   example: Failed to fetch users tickets.
 */
router.get('/tickets', authenticateToken, getUserTickets);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change the logged-in user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "currentpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully.
 *       400:
 *         description: Bad request, e.g., missing fields or incorrect current password
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
 *                   example: Current password is incorrect.
 *       500:
 *         description: Server error while changing password
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
 *                   example: Failed to change password. Please try again later.
 */
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
