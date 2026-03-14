const express = require('express');
const router = express.Router();
const ContactUs = require('../Models/ContactUs');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /contactUs - Submit contact form
router.post('/contactUs', async (req, res) => {
  const { name, email, subject, message } = req.body
  try {
    const contactUs = new ContactUs({ name, email, subject, message })
    await contactUs.save()
    res.status(201).json({ message: "Message sent successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server Error" })
  }
});

// GET /contactus/show - Get all contact messages (admin)
router.get('/contactus/show', async (req, res) => {
  try {
    const messages = await ContactUs.find()
    res.status(200).json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server Error" })
  }
});

// POST /contactus/reply - Reply to contact message
router.post('/contactus/reply', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;

