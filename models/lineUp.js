const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LineUp = sequelize.define('LineUp', {
    author: {
      type: DataTypes.STRING,
      defaultValue: 'Trainer',
        allowNull: true
    },
    formation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    opponent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    players: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true,
});

module.exports = LineUp

