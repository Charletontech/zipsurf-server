const { User, Location, Officer, Transaction } = require('../models');
const TransactionService = require('../services/transaction.service');

class StatsController {
  static async getAdminStats(req, res) {
    try {
      const totalUsers = await User.count({ where: { role: 'user' } });
      const totalLocations = await Location.count();
      const activeOfficers = await Officer.count();
      
      const { Op } = require('sequelize');
      const totalFundedResult = await Transaction.sum('amount', { 
        where: { 
          type: { [Op.or]: ['fund', 'admin-fund'] } 
        } 
      });
      const totalFunded = totalFundedResult || 0;

      res.json({
        status: 'success',
        data: {
          totalFunded,
          totalUsers,
          totalLocations,
          activeOfficers
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      
      // Ensure user can only request their own stats
      if (req.user.id !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }

      const totalSpent = await TransactionService.calculateUserSpent(userId);
      res.json({ status: 'success', data: { totalSpent } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = StatsController;
