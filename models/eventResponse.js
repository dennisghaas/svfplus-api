const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a database configuration

const EventResponse = sequelize.define('EventResponse', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    response: {
        type: DataTypes.ENUM('Zusagen', 'Absagen', 'Unsicher'),
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
});

module.exports = EventResponse;
