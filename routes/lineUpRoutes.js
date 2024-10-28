const express = require('express');
const router = express.Router();
const LineUp = require('../models/lineUp');

/* save line up */
router.post('/', async (req, res) => {
    try {

    } catch (error) {
        console.error(error, 'Fehler beim speichern der Aufstellung!')
    }
});

/* get line up */
router.get('/', async (reg, res) => {
    try {
        const response = await LineUp.findOne()
        res.status(200).json(response);
    } catch (error) {
        console.error(error, 'Fehler beim Laden der gespeicherten Aufstellung')
    }
});

/* delete saved line up by id */
router.delete('/:lineupId', async (res, req) => {
    try {

    } catch (error) {
        console.error(error, 'Deine Aufstellung konnte nicht gespeichert werden')
    }
});

module.exports = router;



