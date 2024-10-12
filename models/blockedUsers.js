const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const BlockedUsers = sequelize.define('BlockedUsers', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: true,
});

module.exports = BlockedUsers;