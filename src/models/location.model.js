const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true // Optional for backward compatibility, but UI will enforce
  },
  codePrefix: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Maintenance'),
    defaultValue: 'Active'
  },
  routerPass: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = Location;
