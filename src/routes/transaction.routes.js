const express = require('express');
const TransactionController = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// All require authentication
router.post('/fund', authenticate, TransactionController.fundWallet);
router.post('/purchase', authenticate, TransactionController.purchaseAccess);
router.get('/history/:userId', authenticate, TransactionController.getUserHistory);

module.exports = router;