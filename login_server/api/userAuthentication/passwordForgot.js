const express = require('express');
const PasswordReset = require('../../models/PasswordReset');
const User = require('../../models/User');
const transporter = require('../helper/mailer');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

// POST route for Forgot Password
router.post('/', (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.json({
                    status: "FAILED",
                    message: "No user found with that email address!"
                });
            }

            // Generate a random 6-digit alphanumeric reset code
            const resetPasswordCode = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Set the expiration time (30 minutes from now)
            const expiresAt = Date.now() + 30 * 60 * 1000;  // 30 minutes

            // Create a new PasswordReset document
            const passwordReset = new PasswordReset({
                userId: user._id,
                resetPasswordCode,
                resetPasswordExpires: expiresAt
            });

            // Save the PasswordReset document to the database
            passwordReset.save()
                .then(() => {

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: 'Forgot Password Request !',
                        text: `Hey ${user.name},\n\nI know you lost your current password. Don't worry, use the 6-digit alpha-numeric code below which will expire in 30 minutes.\n\nCode: ${resetPasswordCode}\n\nUpdate your password now.\n\nThanks\n\nDo not share or reply to this mail.`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.json({
                                status: "FAILED",
                                message: "Error sending email!",
                            });
                        } else {
                            return res.json({
                                status: "SUCCESS",
                                code: resetPasswordCode,
                                userId: user._id,
                                message: "Reset code sent to your email!",
                            });
                        }
                    });
                })
                .catch(err => {
                    console.error(err);
                    return res.json({
                        status: "FAILED",
                        message: "An error occurred while saving the password reset request!"
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while looking up the user!"
            });
        });
});

module.exports = router;