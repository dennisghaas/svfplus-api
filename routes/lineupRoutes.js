const express = require('express');
const router = express.Router();
const LineUp = require('../models/lineup');

/* save a lineup */
router.post('/', async (req, res) => {
    try {
        // Die Daten aus dem Body entnehmen
        const { author, eventId, name, linedUpPlayers, selectedFormation, selectedFormationValue } = req.body;

        // Neues LineUp erstellen
        const newLineUp = await LineUp.create({
            author,
            eventId,
            linedUpPlayers,
            name,
            selectedFormation,
            selectedFormationValue,
        });

        // Erfolgsantwort zurückgeben
        res.status(201).json(newLineUp);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
});

/* get all saved lineups */
router.get('/', async (req, res) => {
    try {
        const lineups = await LineUp.findAll();
        res.status(200).json(lineups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/* get data of lineup based on id */
router.get('/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

/* adjust lineup based on the id */
router.put('/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// Delete all lineups
router.delete('/', async (req, res) => {
    try {
        await LineUp.destroy({ where: {} });
        res.status(200).json({ message: 'All lineups deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a lineup by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lineup = await LineUp.findByPk(id);

        if (!lineup) {
            return res.status(404).json({ error: 'Lineup not found' });
        }

        await lineup.destroy();
        res.status(200).json({ message: 'Lineup deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;