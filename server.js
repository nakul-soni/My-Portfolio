require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests only from your GitHub Pages (and localhost for dev)
app.use(cors({
    origin: [
        "https://nakul-soni.github.io",
        "http://localhost:3000"
    ]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" folder (create it and put assets there)
app.use(express.static(path.join(__dirname, "public")));

// Email configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Send main email to you
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
            `
        });

        // Send confirmation to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank you for contacting me!",
            html: `
                <h2>Thank you for your message!</h2>
                <p>Hi ${name},</p>
                <p>I have received your message and will get back to you as soon as possible.</p>
                <p>Best regards,<br>Nakul Soni</p>
            `
        });

        res.json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
