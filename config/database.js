require('dotenv').config();
const { Sequelize } = require('sequelize');

// Umgebungsabhängige Konfiguration
const env = process.env.NODE_ENV || 'development';

// Datenbankkonfiguration basierend auf der Umgebung
const config = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || null,
    database: process.env.MYSQL_DATABASE || 'development_db',
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  },
};

// Wähle die passende Konfiguration je nach Umgebung
const currentConfig = config[env];

// Erstelle die Sequelize-Instanz basierend auf der aktuellen Konfiguration
const sequelize = new Sequelize(
    currentConfig.database,
    currentConfig.username,
    currentConfig.password,
    {
      host: currentConfig.host,
      dialect: currentConfig.dialect,
      port: currentConfig.port,
    }
);

module.exports = sequelize;