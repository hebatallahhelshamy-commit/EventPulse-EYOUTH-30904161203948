const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/auth');
const { registrationRules } = require('../middleware/validators');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: Event registration management
 */

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Register for an event
 *     tags: [Registrations]
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
 *         description: Registration created successfully
 *       400:
 *         description: Registration failed
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  requireAuth,
  registrationRules,
  validate,
  registrationController.registerForEvent
);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     summary: Get my registrations
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User registrations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/my',
  requireAuth,
  registrationController.getMyRegistrations
);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Registration not found
 */
router.delete(
  '/:id',
  requireAuth,
  registrationController.cancelRegistration
);

module.exports = router;