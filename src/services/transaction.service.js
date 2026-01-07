const { User, Location, Transaction, sequelize } = require('../models');

class TransactionService {
  static async fundWallet(userId, amount, reference = null) {
    const t = await sequelize.transaction();

    try {
      // Idempotency Check
      if (reference) {
        const existingTx = await Transaction.findOne({ where: { reference } });
        if (existingTx) {
          await t.rollback();
          return { balance: 0, transaction: existingTx, duplicate: true }; // Or throw error
        }
      }

      const user = await User.findByPk(userId, { transaction: t });
      if (!user) throw new Error('User not found');
      
      const val = parseFloat(amount);
      if (isNaN(val) || val <= 0) throw new Error('Invalid amount');

      // Update Balance
      user.balance = parseFloat(user.balance) + val;
      await user.save({ transaction: t });

      // Create Record
      const tx = await Transaction.create({
        userId,
        type: 'fund',
        amount: val,
        status: 'Success',
        description: 'Wallet Funding (Paystack)',
        reference
      }, { transaction: t });

      await t.commit();
      return { balance: user.balance, transaction: tx };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async purchaseAccess(userId, locationId, amount) {
    const t = await sequelize.transaction();

    try {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) throw new Error('User not found');

      const location = await Location.findByPk(locationId, { transaction: t });
      if (!location) throw new Error('Location not found');

      const cost = parseFloat(amount) || 1200; 
      
      if (parseFloat(user.balance) < cost) throw new Error('Insufficient funds');

      // Deduct
      user.balance = parseFloat(user.balance) - cost;
      await user.save({ transaction: t });

      // Create Record
      const tx = await Transaction.create({
        userId,
        type: 'debit',
        amount: cost,
        status: 'Success',
        description: `Internet Access - ${location.name}`
      }, { transaction: t });

      await t.commit();

      return {
        balance: user.balance,
        transaction: tx,
        password: location.routerPass
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getUserHistory(userId) {
    return await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  static async calculateUserSpent(userId) {
    const { Op } = require('sequelize');
    const totalSpent = await Transaction.sum('amount', {
      where: {
        userId,
        type: { [Op.or]: ['debit', 'admin-debit'] }
      }
    });
    return totalSpent || 0;
  }
}

module.exports = TransactionService;