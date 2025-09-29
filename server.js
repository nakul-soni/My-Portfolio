// server.js - Render-ready Node.js Contact Form Backend
require("dotenv").config({ path: 'dotenv.env' });
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend (GitHub Pages)
app.use(cors({
    origin: 'https://nakul-soni.github.io'
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// SendGrid configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Send owner notification
        await sgMail.send({
            from: process.env.SENDGRID_FROM,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Sent from portfolio website contact form.</em></p>
            `
        });

        // Confirmation email to user
        await sgMail.send({
            from: process.env.SENDGRID_FROM,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
                <h2>Thank you!</h2>
                <p>Hi ${name},</p>
                <p>Your message has been received. I will get back to you soon.</p>
                <p>Best regards,<br>Nakul Soni</p>
                <hr>
                <p><em>Automated response. Do not reply.</em></p>
            `
        });

        res.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Contact form error:', error);
        const errorMessage = error?.message || 'Failed to send message. Please try again later.';
        res.status(500).json({ success: false, message: errorMessage });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Favicon - return no content to avoid 404 noise in console
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
