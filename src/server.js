require("dotenv").config();
const app = require("./app");
const { Database } = require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Use the new Database class
  await Database.connect();

  // Decide when to sync (e.g., via environment variable or just on start during development)
  if (process.env.NODE_ENV !== "production" || process.env.SYNC_DB === "true") {
    // await Database.sync({ alter: true });
  }

  app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}...`.yellow.bold);
  });
};

startServer();
