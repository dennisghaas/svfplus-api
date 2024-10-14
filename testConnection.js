const sequelize = require('./config/database');

sequelize.authenticate()
    .then(() => {
        console.log('Verbindung zur Datenbank erfolgreich!');
    })
    .catch(err => {
        console.error('Fehler bei der Verbindung zur Datenbank:', err);
    });