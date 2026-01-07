const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Officer = sequelize.define('Officer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
  // locationId association will be added in models/index.js
}, {
  timestamps: true
});

module.exports = Officer;
