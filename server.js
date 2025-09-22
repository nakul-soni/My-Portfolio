// Node.js Backend Server for Contact Form
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//Allow Requests from github pages
app.use(cors({
    origin: 'https://nakul-soni.github.io'
}));

app.use(express.json()); // parse JSON request bodies


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER || 'nakulsoni2006@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASS || 'zvuiqsfqdxydrawa' // Replace with your app password
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'nakulsoni2006@gmail.com',
            to: process.env.EMAIL_USER || 'nakulsoni2006@gmail.com', // Your email to receive messages
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>This message was sent from your portfolio website contact form.</em></p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER || 'nakulsoni2006@gmail.com',
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
                <h2>Thank you for your message!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for reaching out through my portfolio website. I have received your message and will get back to you as soon as possible.</p>
                <p>Best regards,<br>Nakul Soni</p>
                <hr>
                <p><em>This is an automated response. Please do not reply to this email.</em></p>
            `
        };

        await transporter.sendMail(confirmationMailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running'
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view your portfolio`);
});

module.exports = app;
