const LocationService = require('../services/location.service');

class LocationController {
  static async getAllLocations(req, res) {
    try {
      const locations = await LocationService.getAll();
      res.json({ status: 'success', data: locations });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async addLocation(req, res) {
    try {
      const { name, address, status } = req.body;
      const newLocation = await LocationService.create(name, address, status);
      res.status(201).json({ status: 'success', data: newLocation });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const updatedLocation = await LocationService.toggleStatus(id);
      res.json({ status: 'success', data: updatedLocation });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async regeneratePasswords(req, res) {
    try {
      await LocationService.regenerateAllPasswords();
      res.json({ status: 'success', message: 'All passwords regenerated' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await LocationService.delete(id);
      res.json({ status: 'success', message: 'Location deleted successfully' });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = LocationController;
