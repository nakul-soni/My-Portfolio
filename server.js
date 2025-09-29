// server.js - Render-ready Node.js Contact Form Backend
require("dotenv").config({ path: 'dotenv.env' });
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend (GitHub Pages)
app.use(cors({
    origin: 'https://nakul-soni.github.io',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.options('/api/contact', cors());

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Send owner notification
        const ownerResponse = await resend.emails.send({
            from: process.env.RESEND_FROM,
            to: process.env.EMAIL_USER,
            reply_to: email,
            subject: `New Contact Form Submission from ${name}`,
            text: `New contact submission\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
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
        if (ownerResponse && ownerResponse.id) {
            console.log('Resend owner mail id:', ownerResponse.id);
        }

        // Confirmation email to user
        const userResponse = await resend.emails.send({
            from: 'nakulsoni2006@gmail.com',
            to: email,
            subject: 'Thank you for contacting me!',
            text: `Hi ${name},\n\nYour message has been received. I will get back to you soon.\n\nBest regards,\nNakul Soni\n\n(Automated response — do not reply)`,
            html: `
                <h2>Thank you!</h2>
                <p>Hi ${name},</p>
                <p>Your message has been received. I will get back to you soon.</p>
                <p>Best regards,<br>Nakul Soni</p>
                <hr>
                <p><em>Automated response. Do not reply.</em></p>
            `
        });
        if (userResponse && userResponse.id) {
            console.log('Resend user mail id:', userResponse.id);
        }

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
