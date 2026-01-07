const sequelize = require("../config/database");
const User = require("./user.model");
const Location = require("./location.model");
const Officer = require("./officer.model");
const Transaction = require("./transaction.model");
const colors = require("colors");

// --- Associations ---

// User <-> Transactions
User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

// Location <-> Officers
Location.hasMany(Officer, { foreignKey: "locationId", as: "officers" });
Officer.belongsTo(Location, { foreignKey: "locationId", as: "location" });

// --- Database Management Class ---

class Database {
  /**
   * Simply authenticates the connection to the database
   */
  static async connect() {
    try {
      await sequelize.authenticate();
      console.log("Successfully connected to the database.".cyan);
    } catch (error) {
      console.error("Unable to connect to the database:".red.bold, error);
      process.exit(1);
    }
  }

  /**
   * Synchronizes the models with the database and performs seeding
   * @param {Object} options - Sequelize sync options (alter, force, etc)
   */
  static async sync(options = { alter: true }) {
    try {
      await sequelize.sync(options);
      console.log(
        `Database synced with options: ${JSON.stringify(options)}`.green
      );

      await this.seedAdmin();
    } catch (error) {
      console.error("Database synchronization failed:", error);
    }
  }

  /**
   * Internal helper to seed the default admin
   */
  static async seedAdmin() {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@zipsurf.com";
      const adminPass = process.env.ADMIN_PASSWORD || "admin123";

      const existingAdmin = await User.findOne({
        where: { email: adminEmail },
      });
      if (!existingAdmin) {
        await User.create({
          name: "System Admin",
          email: adminEmail,
          password: adminPass,
          role: "admin",
          balance: 999999.0,
        });
        console.log(
          `[Seed] Default Admin created: ${adminEmail}`.bgWhite.black
        );
      }
    } catch (error) {
      console.error("[Seed] Admin seeding failed:", error);
    }
  }
}

module.exports = {
  sequelize,
  Database,
  User,
  Location,
  Officer,
  Transaction,
};
