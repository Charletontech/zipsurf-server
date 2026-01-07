const express = require('express');
const authRoutes = require('./auth.routes');
const locationRoutes = require('./location.routes');
const officerRoutes = require('./officer.routes');
const userRoutes = require('./user.routes');
const transactionRoutes = require('./transaction.routes');
const paystackRoutes = require('./paystack.routes');
const StatsController = require('../controllers/stats.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resources
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/officers', officerRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/paystack', paystackRoutes);

// Stats
router.get('/stats/admin', authenticate, authorizeAdmin, StatsController.getAdminStats);
router.get('/stats/user/:userId', authenticate, StatsController.getUserStats);

module.exports = router;
