const LocationService = require('../services/location.service');

const processPasswords = async () => {
  console.log('[Process] Starting password regeneration...');
  await LocationService.regenerateAllPasswords();
  console.log('[Process] Password regeneration logic completed.');
};

module.exports = processPasswords;
