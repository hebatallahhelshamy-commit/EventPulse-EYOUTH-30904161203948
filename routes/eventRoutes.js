const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

router.post('/', requireAuth, requireRole('admin'), eventController.createEvent);
router.patch('/:id', requireAuth, requireRole('admin'), eventController.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), eventController.deleteEvent);

module.exports = router;