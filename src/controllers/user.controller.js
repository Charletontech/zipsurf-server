const UserService = require('../services/user.service');

class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      res.json({ status: 'success', data: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getOne(req, res) {
    try {
      const user = await UserService.getOne(req.params.id);
      res.json({ status: 'success', data: user });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async updateBalance(req, res) {
    try {
      const { amount } = req.body;
      const user = await UserService.updateBalance(req.params.id, amount);
      res.json({ status: 'success', data: user });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = UserController;
