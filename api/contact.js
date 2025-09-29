const { Resend } = require('resend');

module.exports = async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, email, message } = req.body || {};

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM;
        const owner = process.env.EMAIL_USER;

        // Owner notification
        const ownerResponse = await resend.emails.send({
            from,
            to: owner,
            reply_to: email,
            subject: `New Contact Form Submission from ${name}`,
            text: `New contact submission\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${String(message).replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Sent from portfolio website contact form.</em></p>
            `
        });

        // User confirmation
        const userResponse = await resend.emails.send({
            from,
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

        // CORS for external callers if needed
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ success: true, message: 'Message sent successfully!', ownerId: ownerResponse?.id, userId: userResponse?.id });
    } catch (error) {
        const msg = error?.message || 'Failed to send message. Please try again later.';
        return res.status(500).json({ success: false, message: msg });
    }
}


