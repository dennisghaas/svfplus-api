const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventDescription: {
        type: DataTypes.JSON,
        allowNull: false
    },
    eventType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    venue: {
        type: DataTypes.STRING,
        allowNull: true
    },
    venueStreet: {
        type: DataTypes.STRING,
        allowNull: true
    },
    venuePostalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    standingOrderID: { 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    showInDashboard: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    linkExtern: {
        type: DataTypes.STRING,
        allowNull: true
    },
    playerWithNoAccess: {
        type: DataTypes.JSON,
        allowNull: true
    },
    voteQuestion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    voteOptions: {
        type: DataTypes.JSON,
        allowNull: true
    },
    voteMultipleSelection: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Event;