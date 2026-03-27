const ContactMessage = require("../models/ContactMessage.model");
const { sendMail } = require("../utils/helperFunctions");

// POST /api/contact
// Create a new contact message
const submitContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required fields." });
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            message,
        });

        // Send email to the site administrator
        const adminEmail = process.env.MAIL_USER || 'support@hirex.com';
        await sendMail({
            to: adminEmail,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #2563eb;">New Contact Request</h2>
                    <p>A new message has been submitted via the Contact Us page.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Name</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Email</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Message</td>
                            <td style="padding: 10px; border: 1px solid #e2e8f0;">${message}</td>
                        </tr>
                    </table>
                </div>
            `
        });

        // Send confirmation email to the user
        await sendMail({
            to: email,
            subject: "We received your message! - HireX",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center;">
                    <h2 style="color: #2563eb;">Thank you for contacting us, ${name}!</h2>
                    <p style="color: #475569; font-size: 16px;">We have successfully received your message and our team will get back to you shortly.</p>
                    <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Best regards,<br><strong>The HireX Team</strong></p>
                </div>
            `
        });

        return res.status(201).json({ message: "Contact message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Contact API Error:", error);
        return res.status(500).json({ error: error.message || "Failed to send message" });
    }
};

module.exports = {
    submitContactMessage
};
