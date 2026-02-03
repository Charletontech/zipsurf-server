const { Officer, Location } = require('../models');

class OfficerService {
  static async register(data) {
    // data = { name, phone, address, locationId }
    if (!data.locationId || !data.name) {
      throw new Error('Name and Location are required');
    }

    const location = await Location.findByPk(data.locationId);
    if (!location) throw new Error('Invalid Location ID');

    const stationCode = `ST-${location.codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOfficer = await Officer.create({
      name: data.name,
      phone: data.phone,
      address: data.address,
      locationId: data.locationId,
      stationCode
    });

    return newOfficer;
  }

  static async verify(stationCode) {
    const officer = await Officer.findOne({ where: { stationCode } });
    
    if (!officer) {
       // Fallback logic for demo compatibility if officer not strictly found but code pattern is valid?
       // For a secure backend, we strictly reject if not found in DB.
       // However, to keep the "station code check" logic for just location code:
       // If the code matches a location's prefix (e.g. ST-LEK-XXXX), we might want to check that.
       // BUT standard logic suggests strictly checking registered officers.
       
       // Let's implement strict check + location fallback if allowed, 
       // but strict is better. I'll stick to DB check for professionalism.
       throw new Error('Invalid Station Code');
    }

    const location = await Location.findByPk(officer.locationId);
    if (!location) throw new Error('Assigned location not found');

    return {
      valid: true,
      officerName: officer.name,
      locationName: location.name,
      routerPass: location.routerPass
    };
  }

  static async getAll() {
    return await Officer.findAll({ include: 'location' });
  }

  static async delete(id) {
    const officer = await Officer.findByPk(id);
    if (!officer) {
      throw new Error('Officer not found');
    }
    await officer.destroy();
    return true;
  }
}

module.exports = OfficerService;