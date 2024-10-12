const express = require('express');
const router = express.Router();
const EventResponse = require('../models/eventResponse');

// Create a new response
router.post('/', async (req, res) => {
    try {
        const { userId, eventId, response, reason } = req.body;

        // Check if the response is valid
        if (!['Zusagen', 'Absagen', 'Unsicher'].includes(response)) {
            return res.status(400).json({ message: 'Invalid response' });
        }

        // Check if a response already exists for this user and event
        const existingResponse = await EventResponse.findOne({
            where: { userId, eventId }
        });

        if (existingResponse) {
            // Update existing response
            existingResponse.response = response;
            existingResponse.reason = reason;  // Update the reason
            await existingResponse.save();  // Save the updated response

            return res.status(200).json({ message: 'Response updated successfully.', response: existingResponse });
        }

        // Create new response
        const newResponse = await EventResponse.create({ userId, eventId, response, reason });
        res.status(201).json({ message: 'Response created successfully.', response: newResponse });
    } catch (error) {
        console.error('Error creating or updating event response:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a user's response
router.put('/:userId/:eventId', async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        const { response, reason } = req.body;

        if (!['Zusagen', 'Absagen', 'Unsicher'].includes(response)) {
            return res.status(400).json({ message: 'Invalid response' });
        }

        const [updated] = await EventResponse.update(
            { response, reason },
            { where: { userId, eventId } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Response not found' });
        }

        res.status(200).json({ message: 'Response updated successfully' });
    } catch (error) {
        console.error('Error updating response:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get a user's response for a specific event
router.get('/:userId/:eventId', async (req, res) => {
    try {
        const { userId, eventId } = req.params;
        const response = await EventResponse.findOne({
            where: { userId, eventId }
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching response:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete each reaction
router.delete('/', async (req, res) => {
    try {
        // Lösche alle Reaktionen
        const deletedCount = await EventResponse.destroy({
            where: {}  // Keine Bedingung, um alle Einträge zu löschen
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'No responses found to delete' });
        }

        res.status(200).json({ message: 'All responses deleted successfully' });
    } catch (error) {
        console.error('Error deleting responses:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


// Delete all responses for a specific event
router.delete('/events/:eventId/responses', async (req, res) => {
    try {
        const { eventId } = req.params;

        const deletedResponses = await EventResponse.destroy({
            where: { eventId }
        });

        // Geben Sie eine erfolgreiche Antwort zurück, auch wenn keine Reaktionen gelöscht wurden
        res.status(200).json({
            message: deletedResponses > 0
                ? 'All responses for the event deleted successfully'
                : 'No responses found for this event'
        });
    } catch (error) {
        console.error('Error deleting responses:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all responses for a specific event
router.get('/events/:eventId/responses', async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find all responses for the given event ID
        const responses = await EventResponse.findAll({
            where: { eventId },
            attributes: ['userId', 'response', 'reason'],
        });

        if (responses.length === 0) {
            return res.status(404).json({ message: 'No responses found for this event' });
        }

        res.status(200).json(responses);
    } catch (error) {
        console.error('Error fetching responses for event:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;