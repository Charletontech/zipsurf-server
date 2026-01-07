const express = require('express');
const PaystackController = require('../controllers/paystack.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/initialize', authenticate, PaystackController.initialize);
router.post('/verify', authenticate, PaystackController.verify);

module.exports = router;
