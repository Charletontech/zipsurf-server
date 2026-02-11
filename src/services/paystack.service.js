const axios = require('axios');
const TransactionService = require('./transaction.service');

class PaystackService {
  static async initializeTransaction(userId, email, amount) {
    const baseUrl = process.env.FRONTEND_URL.endsWith('/') 
      ? process.env.FRONTEND_URL.slice(0, -1) 
      : process.env.FRONTEND_URL;

    const params = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      callback_url: `${baseUrl}/dashboard/index.html`, // Dynamic redirect
      metadata: {
        userId,
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: userId
          }
        ]
      }
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        params,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Paystack Init Error:', error.response?.data || error.message);
      throw new Error('Payment initialization failed');
    }
  }

  static async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
      );

      const data = response.data.data;

      if (data.status === 'success') {
        const userId = data.metadata.userId;
        const amount = data.amount / 100; // Convert back to main currency unit

        // Fund the wallet (TransactionService handles idempotency via reference)
        const result = await TransactionService.fundWallet(userId, amount, reference);
        
        if (result.duplicate) {
            console.log(`[Paystack] Duplicate verification attempt for reference: ${reference}`);
        }
        
        return { status: 'success', amount, reference, duplicate: !!result.duplicate };
      } else {
        throw new Error('Transaction was not successful');
      }
    } catch (error) {
      console.error('Paystack Verify Error:', error.response?.data || error.message);
      // If error is duplicate transaction, treat as success or ignore
      if (error.message.includes('Duplicate')) throw error;
      throw new Error('Payment verification failed');
    }
  }

  static async handleWebhook(eventData) {
    const { event, data } = eventData;

    if (event === 'charge.success') {
      const reference = data.reference;
      const userId = data.metadata.userId;
      const amount = data.amount / 100;

      console.log(`[Webhook] Processing successful payment: ${reference} for user: ${userId}`);
      
      try {
        const result = await TransactionService.fundWallet(userId, amount, reference);
        return { success: true, duplicate: !!result.duplicate };
      } catch (error) {
        console.error('[Webhook] Error funding wallet:', error.message);
        throw error;
      }
    }

    return { success: true, message: 'Event ignored' };
  }
}

module.exports = PaystackService;
