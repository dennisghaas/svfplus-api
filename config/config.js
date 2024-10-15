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
        username: process.env.MYSQL_USER_PROD,
        password: process.env.MYSQL_PASSWORD_PROD,
        database: process.env.MYSQL_DATABASE_PROD,
        host: process.env.MYSQL_HOST_PROD,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
    },
};