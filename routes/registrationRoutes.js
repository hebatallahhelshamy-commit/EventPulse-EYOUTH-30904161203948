const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', registrationController.registerForEvent);
router.get('/my', registrationController.getMyRegistrations);
router.delete('/:id', registrationController.cancelRegistration);

module.exports = router;