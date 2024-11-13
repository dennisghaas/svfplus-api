const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const LineUp = sequelize.define('LineUp', {
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    linedUpPlayers: {
        type: DataTypes.JSON,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selectedFormation: {
        type: DataTypes.JSON,
        allowNull: true
    },
    selectedFormationValue: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = LineUp