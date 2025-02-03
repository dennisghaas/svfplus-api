const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventResponseRoutes = require('./routes/eventResponseRoutes');
const standingOrdersRoutes = require('./routes/standingOrdersRoutes')
const blockedUsersRoutes = require('./routes/blockedUserRoutes')
const lineUpRoutes = require('./routes/lineupRoutes');
const {accessCorsOrigin} = require("./config/config");

// Middleware, um JSON-Daten zu parsen
app.use(express.json());

// Konfiguriere CORS
app.use(cors({
  origin: accessCorsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routen verwenden
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-responses', eventResponseRoutes);
app.use('/api/standing-orders', standingOrdersRoutes);
app.use('/api/', blockedUsersRoutes);
app.use('/api/lineup', lineUpRoutes)

// Server starten
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Access-Control-Allow-Origin:', process.env.CORS_ORIGIN);
  console.log(`Server läuft auf Port ${PORT}`);
});

// Datenbank synchronisieren
sequelize.sync({ alter: true })
  .then(() => console.log('Datenbank synchronisiert'))
  .catch(err => console.error('Fehler beim Synchronisieren der Datenbank:', err));