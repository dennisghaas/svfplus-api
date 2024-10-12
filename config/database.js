const { Sequelize } = require('sequelize');

// SQLite-Verbindung einrichten
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './backend/data/database.sqlite' // Speicherort der SQLite-Datenbank
});

module.exports = sequelize;