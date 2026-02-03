const express = require('express');
const OfficerController = require('../controllers/officer.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public Registration (Self-Service)
router.post('/register', OfficerController.register);

// Admin Only List
router.get('/', authenticate, authorizeAdmin, OfficerController.getAll);

// Admin Only Delete
router.delete('/:id', authenticate, authorizeAdmin, OfficerController.delete);

// Public Verify (Officer Login)
router.post('/verify', OfficerController.verify);

module.exports = router;
