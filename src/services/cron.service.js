const cron = require('node-cron');
const LocationService = require('./location.service');

class CronService {
  static init() {
    console.log('[CronService] Initializing internal scheduler...');

    // Schedule: 6:45 AM every day
    // Cron Syntax: Minute Hour Day Month DayOfWeek
    cron.schedule('45 6 * * *', async () => {
      console.log('[CronService] Running scheduled password regeneration...');
      try {
        await LocationService.regenerateAllPasswords();
        console.log('[CronService] Passwords regenerated successfully.');
      } catch (error) {
        console.error('[CronService] Failed to regenerate passwords:', error);
      }
    }, {
      scheduled: true,
      timezone: "Africa/Lagos" // Or your preferred timezone
    });
  }
}

module.exports = CronService;
