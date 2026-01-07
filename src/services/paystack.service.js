const axios = require('axios');
const TransactionService = require('./transaction.service');

class PaystackService {
  static async initializeTransaction(userId, email, amount) {
    const params = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      callback_url: `${process.env.FRONTEND_URL}/frontend/dashboard/index.html`, // Dynamic redirect
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

        // Fund the wallet
        // We might want to check if this reference was already processed to avoid double funding
        // For this prototype, we'll assume TransactionService handles idempotency or we just process it.
        // Ideally, store the 'reference' in the Transaction model to enforce uniqueness.
        
        await TransactionService.fundWallet(userId, amount, reference);
        
        return { status: 'success', amount, reference };
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
}

module.exports = PaystackService;
