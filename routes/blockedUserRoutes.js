const express = require('express');
const router = express.Router();
const BlockedUsers = require('../models/blockedUsers');

// POST-Route, um einen geblockten User hinzuzufügen
router.post('/block', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Erstelle einen neuen BlockedUser
        const newBlockedUser = await BlockedUsers.create({ email, username });
        res.status(201).json({
            message: 'User successfully blocked',
            data: newBlockedUser
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'User is already blocked' });
        }
        res.status(500).json({ message: 'Error blocking the user', error });
    }
});

// Rufe alle geblockten User auf
router.get('/blocked-users', async (req, res) => {
    try {
        const blockedUsers = await BlockedUsers.findAll();
        res.status(200).json(blockedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blocked users', error });
    }
});

// Lösche einen geblockten User über die ID des Nutzers
router.delete('/blocked-users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Finde den BlockedUser anhand der ID
        const blockedUser = await BlockedUsers.findByPk(id);
        if (!blockedUser) {
            return res.status(404).json({ message: 'Blocked user not found' });
        }

        // Lösche den BlockedUser
        await blockedUser.destroy();
        res.status(200).json({ message: 'Blocked user deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blocked user', error });
    }
});

module.exports = router;