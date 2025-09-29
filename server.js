// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "https://nakul-soni.github.io", // your frontend
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS  // Gmail App Password
  }
});

// Contact API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Mail to yourself
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New message from ${name}`,
      html: `
        <h3>New Portfolio Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    // Confirmation mail to user
    await transporter.sendMail({
      from: `"Nakul Portfolio" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Thanks for contacting me!",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out via my portfolio website. I’ll get back to you soon!</p>
        <p>— Nakul</p>
      `
    });

    res.json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
