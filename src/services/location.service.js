const { Location } = require('../models');

class LocationService {
  static async getAll() {
    return await Location.findAll();
  }

  static async create(name, address, status) {
    const prefix = name.substring(0, 3).toUpperCase();
    
    // Generate unique Station Code & Password
    const stationCode = `ST-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const routerPass = `WIFI-${prefix}-${new Date().getDate()}X${Math.floor(Math.random() * 100)}`;
    
    const newLocation = await Location.create({
      name,
      address,
      status: status || 'Active',
      routerPass,
      stationCode,
      codePrefix: prefix
    });
    
    return newLocation;
  }

  static async toggleStatus(id) {
    const location = await Location.findByPk(id);
    if (!location) throw new Error('Location not found');
    
    location.status = location.status === 'Active' ? 'Maintenance' : 'Active';
    await location.save();
    return location;
  }

  static async regenerateAllPasswords() {
    const locations = await Location.findAll();
    const updates = locations.map(loc => {
      const parts = loc.routerPass.split('-');
      // Keep prefix, regenerate suffix
      loc.routerPass = `${parts[0]}-${parts[1]}-${new Date().getDate()}X${Math.floor(Math.random() * 1000)}`;
      return loc.save();
    });
    
    await Promise.all(updates);
    return true;
  }

  static async delete(id) {
    const location = await Location.findByPk(id);
    if (!location) {
      throw new Error('Location not found');
    }
    await location.destroy();
    return true;
  }
}

module.exports = LocationService;