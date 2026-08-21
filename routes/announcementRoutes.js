const express = require('express');
const router = express.Router();
const announcementsController = require('../controllers/announcementsController');
const { requireAuth, requireRole } = require('../middleware/auth');

// جلب سجل الإعلانات متاح للجميع
router.get('/:eventId', announcementsController.getAnnouncements);

// إرسال إعلان متاح فقط للـ Admin
router.post('/', requireAuth, requireRole('admin'), announcementsController.createAnnouncement);

module.exports = router;