const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendPasswordResetEmail(email, token) {
    console.log('EMAIL PASS', process.env.EMAIL_PASS)
    console.log('EMAIL USER', process.env.EMAIL_USER)
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER oder EMAIL_PASS ist nicht gesetzt');
        }

        if (!process.env.CORS_ORIGIN) {
            throw new Error('CORS_ORIGIN ist nicht gesetzt');
        }

        // Transporter erstellen - verwende hier deinen SMTP-Server oder ein E-Mail-Sending-Service wie Gmail, SendGrid, etc.
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Erstelle die E-Mail-Inhalte
        const mailOptions = {
            from: `"SVF Plus" <${process.env.EMAIL_USER}>`, // Absenderadresse
            to: email, // Empfängeradresse
            subject: 'Passwort zurücksetzen', // Betreff der E-Mail
            text: `Sie haben eine Anfrage zum Zurücksetzen des Passworts gestellt. Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen: \n\n${process.env.CORS_ORIGIN}/reset-password?token=${token}`,
            html: `<p>Sie haben eine Anfrage zum Zurücksetzen des Passworts gestellt. Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p><p><a href="${process.env.CORS_ORIGIN}/reset-password?token=${token}">Passwort zurücksetzen</a></p>`,
        };

        // Sende die E-Mail
        await transporter.sendMail(mailOptions);
        console.log('E-Mail zum Zurücksetzen wurde gesendet an:', email);
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail zum Zurücksetzen:', error);
        throw new Error('E-Mail konnte nicht gesendet werden');
    }
}

module.exports = sendPasswordResetEmail;
