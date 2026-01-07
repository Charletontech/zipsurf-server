const express = require('express');
const UserController = require('../controllers/user.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, UserController.getAll);
router.get('/:id', authenticate, UserController.getOne);

// Moved strict balance update to Admin Only
router.patch('/:id/balance', authenticate, authorizeAdmin, UserController.updateBalance);

module.exports = router;