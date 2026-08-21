const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcementsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/:eventId', announcementsController.getAnnouncements);

router.post('/', requireAuth, requireRole('admin'), announcementsController.createAnnouncement);

module.exports = router;