const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  // Admin specific login could be same endpoint, checked via role in frontend redirect
  // or a separate endpoint if needed. For now, general login works for all roles.
}

module.exports = AuthController;
