const express = require('express');
const router = express.Router();

const announcementsController = require('../controllers/announcementsController');
const { requireAuth, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Event announcements management
 */

/**
 * @swagger
 * /api/announcements/{eventId}:
 *   get:
 *     summary: Get announcements for an event
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:eventId', announcementsController.getAnnouncements);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Create an announcement
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  announcementsController.createAnnouncement
);

module.exports = router;