const express = require('express');
const router = express.Router();
const StandingOrders = require('../models/standingOrders');

// Route zum Erstellen oder Aktualisieren eines Dauerauftrags
router.post('/', async (req, res) => {
  try {
    const { standingOrderID, eventIDs } = req.body;

    console.log('Request Body:', req.body);  // Debugging

    if (!standingOrderID || !Array.isArray(eventIDs)) {
      return res.status(400).json({ message: 'Fehlende oder ungültige Daten' });
    }

    // Finde oder erstelle den Dauerauftrag
    const [standingOrder, created] = await StandingOrders.upsert({
      id: standingOrderID,
      eventIDs: eventIDs
    }, {
      returning: true
    });

    res.status(200).json(standingOrder);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Dauerauftrags-Anfrage:', error);
    res.status(500).json({ message: 'Serverfehler' });
  }
});

// Route zum Abrufen aller Daueraufträge
router.get('/', async (req, res) => {
  try {
    console.log('Anfrage zum Abrufen aller Daueraufträge');

    // Finde alle Daueraufträge
    const standingOrders = await StandingOrders.findAll();

    if (!standingOrders || standingOrders.length === 0) {
      console.warn('Keine Daueraufträge gefunden');
      return res.status(404).json({ message: 'Keine Daueraufträge gefunden' });
    }

    console.log('Daueraufträge gefunden:', standingOrders);

    res.status(200).json(standingOrders);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daueraufträge:', error);
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

// Route zum Abrufen eines Dauerauftrags
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Anfrage zum Abrufen eines Dauerauftrags für ID:', id);

    const standingOrder = await StandingOrders.findByPk(id);

    if (!standingOrder) {
      console.warn('Dauerauftrag nicht gefunden für ID:', id);
      return res.status(404).json({ message: 'Dauerauftrag nicht gefunden' });
    }

    console.log('Dauerauftrag gefunden:', standingOrder);

    res.status(200).json(standingOrder);
  } catch (error) {
    console.error('Fehler beim Abrufen des Dauerauftrags:', error);
    res.status(500).json({ message: 'Serverfehler', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const standingOrderID = req.params.id;
    const deletedCount = await StandingOrders.destroy({
      where: {
        id: standingOrderID
      }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Standing order not found' });
    }

    res.status(200).json({ message: 'Standing order deleted successfully' });
  } catch (error) {
    console.error('Error deleting standing order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:standingOrderID/event/:eventID', async (req, res) => {
  try {
    const { standingOrderID, eventID } = req.params;

    // Finde den Standing Order nach ID
    const standingOrder = await StandingOrders.findByPk(standingOrderID);

    if (!standingOrder) {
      return res.status(404).json({ message: 'Standing Order nicht gefunden' });
    }

    // Finde das spezifische Event in der eventIDs Liste
    const event = standingOrder.eventIDs.find(id => id === parseInt(eventID));

    if (!event) {
      return res.status(404).json({ message: 'Event nicht gefunden' });
    }

    res.status(200).json({ eventID: event });
  } catch (error) {
    console.error('Fehler beim Abrufen des Events:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Events' });
  }
});

router.delete('/:standingOrderID/event/:eventID', async (req, res) => {
  try {
    const { standingOrderID, eventID } = req.params;

    // Find the standing order by ID
    const standingOrder = await StandingOrders.findByPk(standingOrderID);

    if (!standingOrder) {
      return res.status(404).json({ message: 'Standing order not found' });
    }

    // Filter out the eventID from the eventIDs array
    const updatedEventIDs = standingOrder.eventIDs.filter(id => id !== parseInt(eventID));

    // Update the standing order with the modified eventIDs
    standingOrder.eventIDs = updatedEventIDs;
    await standingOrder.save();

    res.status(200).json({ message: `Event ID ${eventID} removed from standing order`, updatedEventIDs });
  } catch (error) {
    console.error('Error removing event from standing order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;