const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  accessRights: {
    type: DataTypes.STRING,
    defaultValue: 'svf_private' 
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  debts: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, 
    defaultValue: 0.00
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  gotRejected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  gotSuit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isInjured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isInjuredType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isInjuredUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  jerseyNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "[\"Spieler\"]"
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userImage: {
    type: DataTypes.JSON,
    allowNull: false
  },
  userIsActivated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tutorial: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    unique: false,
    defaultValue: true
  }
});

module.exports = User;