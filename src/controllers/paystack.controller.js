const PaystackService = require('../services/paystack.service');

class PaystackController {
  static async initialize(req, res) {
    try {
      const { amount } = req.body;
      const userId = req.user.id;
      const email = req.user.email;

      const result = await PaystackService.initializeTransaction(userId, email, amount);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async verify(req, res) {
    try {
      const { reference } = req.body;
      const result = await PaystackService.verifyTransaction(reference);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = PaystackController;
