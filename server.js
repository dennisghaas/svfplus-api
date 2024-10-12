const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventResponseRoutes = require('./routes/eventResponseRoutes');
const standingOrdersRoutes = require('./routes/standingOrdersRoutes')
const blockedUsersRoutes = require('./routes/blockedUserRoutes')

// Middleware, um JSON-Daten zu parsen
app.use(express.json());

// Konfiguriere CORS
const corsOptions = {
  origin: (req, callback) => {
    const isDev = process.env.NODE_ENV === 'development'; // Überprüfe, ob die Umgebung Entwicklung ist
    const origin = isDev ? process.env.CORS_ORIGIN_DEV : process.env.CORS_ORIGIN_PROD;
    callback(null, origin); // Erlaube den Zugriff basierend auf der Umgebung
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Routen verwenden
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-responses', eventResponseRoutes);
app.use('/api/standing-orders', standingOrdersRoutes);
app.use('/api/blocked-users', blockedUsersRoutes);

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