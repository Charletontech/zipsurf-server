const OfficerService = require('../services/officer.service');

class OfficerController {
  static async register(req, res) {
    try {
      const data = req.body;
      const officer = await OfficerService.register(data);
      res.status(201).json({ status: 'success', data: officer });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async verify(req, res) {
    try {
      const { stationCode } = req.body;
      const result = await OfficerService.verify(stationCode);
      res.json({ status: 'success', data: result });
    } catch (error) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const officers = await OfficerService.getAll();
      res.json({ status: 'success', data: officers });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = OfficerController;
