// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendPasswordResetEmail = require('../utils/sendPasswordResetEmail');

// Neuen Nutzer registieren
router.post('/register', async (req, res) => {
    console.log('Secret Key:', process.env.SECRET_KEY);
    try {
        const {
            accessRights,
            birthday,
            debts,
            email,
            gotSuit,
            isInjured,
            isInjuredType,
            isInjuredUntil,
            jerseyNumber,
            name,
            password,
            position,
            role,
            surname,
            userIsActivated,
            userImage,
            username,
            watchedTutorial,
        } = req.body;

        const existingUser = await User.findOne({where: {username}});
        if (existingUser) {
            return res.status(400).json({error: 'Benutzername bereits vergeben'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            accessRights,
            birthday,
            debts,
            email,
            gotSuit,
            isInjured,
            isInjuredType,
            isInjuredUntil,
            jerseyNumber,
            name,
            password: hashedPassword,
            position,
            role,
            surname,
            userImage,
            userIsActivated,
            username,
            watchedTutorial
        });

        // Token erstellen
        const token = jwt.sign({userId: newUser.id, role: newUser.role}, process.env.SECRET_KEY, {expiresIn: '28d'});

        // Erfolgreiche Registrierung und Token zurückgeben
        res.status(201).json({
            message: 'Erfolgreich registriert', token, user: newUser
        });

    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        res.status(400).json({error: error.message});
    }
});

// Login-Route mit Token-Generierung
router.post('/login', async (req, res) => {
    console.log('Secret Key:', process.env.SECRET_KEY);

    try {
        const { username, password } = req.body;

        // Benutzer anhand des Benutzernamens suchen
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }

        // Überprüfe, ob der Benutzer aktiviert ist
        if (!user.userIsActivated) {
            return res.status(403).json({ error: 'Benutzerkonto ist nicht aktiviert. Habe noch ein wenig Geduld.' });
        }

        // Passwort überprüfen
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }

        // Token erstellen
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '28d' });

        res.status(200).json({ message: 'Erfolgreich angemeldet', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route um ein Passwort zu ändern
router.put('/change-password', async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        // Überprüfen, ob userId bereitgestellt wurde
        if (!userId) {
            return res.status(400).json({ error: 'Benutzer-ID muss angegeben werden' });
        }

        // Benutzer anhand der ID suchen
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        // Altes Passwort überprüfen
        const validOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validOldPassword) {
            return res.status(401).json({ error: 'Das alte Passwort ist falsch' });
        }

        // Neues Passwort verschlüsseln und aktualisieren
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        // Passwort speichern
        await user.save();

        res.status(200).json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route zum Abrufen der Benutzerdaten
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Token aus Header holen
        console.log('Authorization header:', req.headers.authorization); // Debugging: Header anzeigen
        if (!token) {
            return res.status(401).json({error: 'Nicht autorisiert'});
        }

        // Token überprüfen
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded Token:', decoded); // Debugging: Dekodiertes Token anzeigen
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            console.log('User not found with ID:', decoded.userId); // Debugging: Benutzer-ID anzeigen
            return res.status(404).json({error: 'Benutzer nicht gefunden'});
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in /me route:', error); // Debugging: Fehler in der Route anzeigen
        res.status(500).json({error: error.message});
    }
});

// Alle Benutzer abrufen
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Route zum Löschen aller Benutzer
router.delete('/delete-all', async (req, res) => {
    console.log('DELETE /delete-all route hit');
    try {
        const result = await User.destroy({where: {}}); // Löscht alle Benutzer
        if (result === 0) {
            return res.status(404).json({message: 'Keine Benutzer gefunden, die gelöscht werden können'});
        }
        res.status(200).json({message: 'Alle Benutzer erfolgreich gelöscht'});
    } catch (error) {
        console.error('Fehler beim Löschen aller Benutzer:', error);
        res.status(500).json({error: 'Fehler beim Löschen der Benutzer', error});
    }
});

// Nutzer nach ID löschen
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Retrieve the user ID from the URL
        const result = await User.destroy({where: {id: userId}}); // Delete the user by ID

        if (result === 0) {
            return res.status(404).json({message: 'User not found'}); // Handle case if user does not exist
        }

        res.status(200).json({message: 'User successfully deleted'}); // User deleted successfully
    } catch (error) {
        console.error('Error deleting user:', error); // Log the error
        res.status(500).json({error: 'An error occurred while deleting the user'}); // Return server error
    }
});

// Finde Nutzer nach ID
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.findByPk(userId); // Use Sequelize's findByPk method to find the user by primary key (ID)

        console.log('User ID:', userId);
        console.log('User found:', user);

        if (user) {
            res.status(200).json(user); // Send back the user data if found
        } else {
            res.status(404).json({error: 'User not found'}); // Handle the case where the user doesn't exist
        }
    } catch (error) {
        res.status(400).json({error: error.message}); // Handle any errors
    }
});

router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const {
        accessRights,
        birthday,
        debts,
        gotRejected,
        gotSuit,
        isInjured,
        isInjuredType,
        isInjuredUntil,
        jerseyNumber,
        name,
        password,
        position,
        role,
        surname,
        userImage,
        userIsActivated,
        watchedTutorial
    } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Benutzer aktualisieren, aber id, username und email auslassen
        await user.update({
            accessRights,
            birthday,
            debts,
            gotRejected,
            gotSuit,
            isInjured,
            isInjuredType,
            isInjuredUntil,
            jerseyNumber,
            name,
            password,
            position,
            role,
            surname,
            userImage,
            userIsActivated,
            watchedTutorial
        });

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;