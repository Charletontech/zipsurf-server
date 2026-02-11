const PaystackService = require('../services/paystack.service');
const crypto = require('crypto');

class PaystackController {
  static async initialize(req, res) {
    // ... existing code ...
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

  static async webhook(req, res) {
    try {
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(req.rawBody || JSON.stringify(req.body))
        .digest('hex');
      
      if (hash === req.headers['x-paystack-signature']) {
        const result = await PaystackService.handleWebhook(req.body);
        return res.status(200).json(result);
      } else {
        console.error('[Webhook] Invalid signature');
        return res.status(400).send('Invalid signature');
      }
    } catch (error) {
      console.error('[Webhook] Error:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = PaystackController;
