// Beispiel für ein Sequelize-Modell
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StandingOrders = sequelize.define('StandingOrders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventIDs: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

module.exports = StandingOrders;