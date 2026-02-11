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
      // 1. Check if the request has a body (Paystack sometimes sends empty pings to test the URL)
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(200).send("Webhook Received");
      }

      const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(req.rawBody || JSON.stringify(req.body))
        .digest("hex");

      if (hash === req.headers["x-paystack-signature"]) {
        const result = await PaystackService.handleWebhook(req.body);
        return res.status(200).json(result);
      } else {
        // We log the error but return 200 so Paystack doesn't disable the webhook
        console.error("[Webhook] Invalid signature detected");
        // return res.status(400).send('Invalid signature');
        return res.status(200).send("Invalid signature");
      }
    } catch (error) {
      console.error("[Webhook] Error:", error.message);
      // Always return 200 to Paystack to acknowledge receipt
      // res.status(500).json({ status: 'error', message: error.message }
      res.status(200).json({ status: "error", message: error.message });
    }
  }
}

module.exports = PaystackController;
