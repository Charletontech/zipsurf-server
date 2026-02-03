require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });

const fs = require("fs");
const path = require("path");
const { sequelize } = require("../src/models"); // Initializes Sequelize
const processPasswords = require("../src/scripts/process_passwords");

// Paths
// Using a temp path for lock file is safer on some hosting, or local
const LOCK_FILE = path.join(__dirname, "zipsurf-refresh.lock");
const LOG_FILE = path.join(__dirname, "cron.log");

// Simple logger
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim()); // Also print to stdout for cPanel logs
  fs.appendFileSync(LOG_FILE, logMessage);
}

(async () => {
  // Prevent overlapping runs
  if (fs.existsSync(LOCK_FILE)) {
    // Check if lock file is stale (older than 1 hour)
    const stats = fs.statSync(LOCK_FILE);
    const now = new Date().getTime();
    const lockAge = now - stats.mtime.getTime();
    
    if (lockAge > 3600000) {
        log("Found stale lock file. Removing and proceeding.");
        fs.unlinkSync(LOCK_FILE);
    } else {
        log("Cron already running (Lock file exists). Exiting.");
        process.exit(0);
    }
  }

  // Create lock file
  fs.writeFileSync(LOCK_FILE, process.pid.toString());

  log("Cron job started: Refreshing Router Passwords.");

  try {
    await sequelize.authenticate();
    await processPasswords();
    log("Cron job completed successfully.");
  } catch (error) {
    log(`Cron job failed: ${error.stack || error.message}`);
  } finally {
    try {
      await sequelize.close();
      log("Database connection closed.");
    } catch (err) {
      log(`Failed to close database connection: ${err.message}`);
    }

    // Remove lock file
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }

    process.exit(0);
  }
})();
