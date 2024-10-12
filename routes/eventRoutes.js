const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Termin erstellen
router.post('/create', async (req, res) => {
    try {
        const {
            eventDescription,
            eventType,
            eventDate,
            venue,
            venueStreet,
            venuePostalCode,
            standingOrderID, 
            showInDashboard,
            linkExtern,
            playerWithNoAccess,
            voteQuestion,
            voteOptions,
            voteMultipleSelection
        } = req.body;

        // Neuen Termin erstellen
        const newEvent = await Event.create({
            eventDescription,
            eventType,
            eventDate,
            venue,
            venueStreet,
            venuePostalCode,
            standingOrderID,
            showInDashboard,
            linkExtern,
            playerWithNoAccess,
            voteQuestion,
            voteOptions,
            voteMultipleSelection
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Alle Termine abrufen
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Alle Termine einer spezefischen Route hinzufügen
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Termin mithilfe der ID bearbeiten
router.put('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const {
            author,
            eventDescription,
            eventType,
            eventDate,
            venue,
            venueStreet,
            venuePostalCode,
            standingOrderID, 
            showInDashboard,
            linkExtern,
            playerWithNoAccess,
            voteQuestion,
            voteOptions,
            voteMultipleSelection
        } = req.body;

        const [updated] = await Event.update({
            author,
            eventDescription,
            eventType,
            eventDate,
            venue,
            venueStreet,
            venuePostalCode,
            standingOrderID,
            showInDashboard,
            linkExtern,
            playerWithNoAccess,
            voteQuestion,
            voteOptions,
            voteMultipleSelection
        }, {
            where: { id: eventId }
        });

        if (updated === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updatedEvent = await Event.findByPk(eventId);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alle Termine löschen
router.delete('/delete-all', async (req, res) => {
    console.log('DELETE /delete-all route hit');
    try {
        const result = await Event.destroy({ where: {} });
        console.log(`Number of records deleted: ${result}`);
        if (result === 0) {
            console.log('No events found to delete');
            return res.status(404).json({ message: 'No events found to delete' });
        }
        console.log('All events successfully deleted');
        res.status(200).json({ message: 'All events successfully deleted' });
    } catch (error) {
        console.error('Error deleting all events:', error);
        res.status(500).json({ error: 'Error deleting events' });
    }
});

// Termine nach bestimmter ID löschen
router.delete('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEventCount = await Event.destroy({
            where: { id: eventId }
        });

        if (deletedEventCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
});

module.exports = router;