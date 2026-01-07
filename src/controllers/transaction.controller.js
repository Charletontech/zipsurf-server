const TransactionService = require('../services/transaction.service');

class TransactionController {
  static async fundWallet(req, res) {
    try {
      const { userId, amount } = req.body;
      const result = await TransactionService.fundWallet(userId, amount);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async purchaseAccess(req, res) {
    try {
      const { userId, locationId, amount } = req.body;
      const result = await TransactionService.purchaseAccess(userId, locationId, amount);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async getUserHistory(req, res) {
    try {
      const { userId } = req.params;
      const history = await TransactionService.getUserHistory(userId);
      res.json({ status: 'success', data: history });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = TransactionController;
