const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  static async register(data) {
    const { name, email, password } = data;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
  }

  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
  }

  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }
}

module.exports = AuthService;
