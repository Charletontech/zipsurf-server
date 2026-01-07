const { User, Transaction, sequelize } = require('../models');

class UserService {
  static async getAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  static async getOne(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateBalance(id, newBalance) {
    const t = await sequelize.transaction();

    try {
      const user = await User.findByPk(id, { transaction: t });
      if (!user) throw new Error('User not found');
      
      const oldBalance = parseFloat(user.balance);
      const targetBalance = parseFloat(newBalance);
      const diff = targetBalance - oldBalance;

      if (diff === 0) {
          await t.rollback();
          return user; // No change
      }

      // Update Balance
      user.balance = targetBalance;
      await user.save({ transaction: t });

      // Record Transaction
      const type = diff > 0 ? 'admin-fund' : 'admin-debit';
      const amount = Math.abs(diff);

      await Transaction.create({
          userId: id,
          type: type,
          amount: amount,
          status: 'Success',
          description: 'Admin Balance Adjustment'
      }, { transaction: t });
      
      await t.commit();
      
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;

    } catch (error) {
        await t.rollback();
        throw error;
    }
  }
}

module.exports = UserService;
