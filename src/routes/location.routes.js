const express = require('express');
const LocationController = require('../controllers/location.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', LocationController.getAllLocations); // Public read? Or protected? Let's keep public for frontend dropdowns.

// Admin Only
router.post('/', authenticate, authorizeAdmin, LocationController.addLocation);
router.patch('/:id/status', authenticate, authorizeAdmin, LocationController.toggleStatus);
router.delete('/:id', authenticate, authorizeAdmin, LocationController.delete);
router.post('/regenerate-passwords', authenticate, authorizeAdmin, LocationController.regeneratePasswords);

module.exports = router;