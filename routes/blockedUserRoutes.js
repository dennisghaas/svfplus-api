const express = require('express');
const router = express.Router();
const redis = require('config/database'); // Hier wird der Redis-Client importiert

// POST-Route, um einen geblockten User hinzuzufügen
router.post('/block', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Finde heraus, ob der Benutzer bereits blockiert ist
        const existingUser = await redis.get(email); // Hier verwenden wir die E-Mail als Schlüssel
        if (existingUser) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        // Speichere den neuen geblockten Benutzer in Redis
        await redis.set(email, JSON.stringify({ username, email }));
        res.status(201).json({
            message: 'User successfully blocked',
            data: { email, username }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking the user', error });
    }
});

// Rufe alle geblockten User auf
router.get('/blocked-users', async (req, res) => {
    try {
        // In Redis haben wir keine direkte Möglichkeit, alle Schlüssel abzurufen.
        // Du könntest jedoch einen bestimmten Muster verwenden, z. B. "blocked_user:*"
        const blockedUsersKeys = await redis.keys('*'); // Alle Schlüssel abrufen
        const blockedUsers = [];

        for (const key of blockedUsersKeys) {
            const user = await redis.get(key);
            if (user) {
                blockedUsers.push(JSON.parse(user));
            }
        }

        if (blockedUsers.length === 0) {
            return res.status(200).json({ message: 'No blocked users found', data: [] });
        }

        res.status(200).json({ message: 'Blocked users retrieved successfully', data: blockedUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blocked users', error: error.message });
    }
});

// Lösche einen geblockten User über die E-Mail-Adresse
router.delete('/blocked-users/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Überprüfe, ob der Benutzer blockiert ist
        const blockedUser = await redis.get(email);
        if (!blockedUser) {
            return res.status(404).json({ message: 'Blocked user not found' });
        }

        // Lösche den BlockedUser
        await redis.del(email);
        res.status(200).json({ message: 'Blocked user deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blocked user', error });
    }
});

module.exports = router;