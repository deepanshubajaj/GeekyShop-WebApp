const express = require('express');
const ContactForm = require('../../models/ContactForm');
const transporter = require('../helper/mailer');
require('dotenv').config();

const router = express.Router();

// Contact Form Route
router.post('/', (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.json({
            status: "FAILED",
            message: "All fields are required!"
        });
    }

    // Get current date and time
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];  // YYYY-MM-DD
    const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // HH:MM AM/PM

    // Save the contact form details in the database
    const newContactForm = new ContactForm({
        name,
        email,
        message,
        date,
        time
    });

    // Save to the database
    newContactForm.save()
        .then(() => {
            // Send email to the user
            const userMailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Thank you for Contacting me! 😊',
                text: `Hello ${name},\n\nThank you for reaching out! 😊\n\nI will respond to your mail as soon as I get available.\n\nBest Regards,\n${process.env.BOSS_NAME}`
            };

            // Send email to admin (you)
            const adminMailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'Hey Boss! Someone contacted you through Geeky-Shop Form!',
                text: `Hello Boss - ${process.env.BOSS_NAME},\n\n"${name}" with "${email}" has contacted you from Geeky-Shop contact form.\n\nHis/Her message for you is:\n" ${message} "\n\nBoss, Please check this out and reply the person back!!\n\nWill keep you Updated !! 😉\n\nBye Bye !! 👋🏻`
            };

            // Send the emails
            transporter.sendMail(userMailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email to user: ", err);
                    return res.json({
                        status: "FAILED",
                        message: "An error occurred while sending the acknowledgment email!"
                    });
                } else {
                    // Send admin email
                    transporter.sendMail(adminMailOptions, (err, info) => {
                        if (err) {
                            console.error("Error sending email to admin: ", err);
                            return res.json({
                                status: "FAILED",
                                message: "An error occurred while notifying the admin!"
                            });
                        } else {
                            // If both emails are sent successfully
                            return res.json({
                                status: "SUCCESS",
                                message: "Contact information sent successfully!"
                            });
                        }
                    });
                }
            });
        })
        .catch(err => {
            console.error("Error saving contact form data: ", err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while saving the contact form data!"
            });
        });
});

module.exports = router;