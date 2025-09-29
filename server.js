// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const sgMail = require("@sendgrid/mail");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors({ origin: "https://nakul-soni.github.io" })); // Allow GitHub Pages frontend
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Root route (health check / portfolio)
app.get("/", (req, res) => {
  res.send("Portfolio backend is running 🚀");
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Email to portfolio owner
    const ownerMsg = {
      to: process.env.CONTACT_RECEIVER_EMAIL || "nakulsoni2006@gmail.com",
      from: process.env.SENDGRID_FROM, // must be verified in SendGrid
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || "").replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>This message was sent from your portfolio website contact form.</em></p>
      `,
    };

    // Confirmation email to user
    const confirmationMsg = {
      to: email,
      from: process.env.SENDGRID_FROM, // must be verified in SendGrid
      subject: "Thank you for contacting me!",
      html: `
        <h2>Thank you for your message!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out through my portfolio website. I have received your message and will get back to you soon.</p>
        <p>Best regards,<br>Nakul Soni</p>
        <hr>
        <p><em>This is an automated response.</em></p>
      `,
    };

    // Send both emails in parallel
    await Promise.all([sgMail.send(ownerMsg), sgMail.send(confirmationMsg)]);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error);
    if (error.response && error.response.body) {
      console.error("SendGrid response body:", error.response.body);
    }
    res
      .status(500)
      .json({ success: false, message: "Failed to send message. Please try again later." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your portfolio`);
});
