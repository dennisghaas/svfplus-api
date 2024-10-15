require('dotenv').config();

module.exports = {
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