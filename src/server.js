require('dotenv').config();
const app = require('./app');
const { Database } = require('./models');
const CronService = require('./services/cron.service');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Use the new Database class
  await Database.connect();
  
  // Decide when to sync
  if (process.env.NODE_ENV !== 'production' || process.env.SYNC_DB === 'true') {
    await Database.sync({ alter: true });
  }

  // Initialize Internal Cron (AWS/VPS mode)
  if (process.env.ENABLE_INTERNAL_CRON === 'true') {
    CronService.init();
  }

  app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
  });
};

startServer();
