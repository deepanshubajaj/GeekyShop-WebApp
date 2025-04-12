const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const PasswordReset = require('../../models/PasswordReset');
const router = express.Router();

// POST route for Reset Password 
router.post('/', (req, res) => {
    const { userId, resetPasswordCode, newPassword } = req.body;

    // Validate input
    if (!userId || !resetPasswordCode || !newPassword) {
        return res.json({
            status: "FAILED",
            message: "All fields are required!"
        });
    }

    // Find the PasswordReset document for the user and code
    PasswordReset.findOne({ userId, resetPasswordCode })
        .then(passwordReset => {
            if (!passwordReset) {
                return res.json({
                    status: "FAILED",
                    message: "Invalid reset code!"
                });
            }

            // Check if the reset code has expired
            if (passwordReset.resetPasswordExpires < Date.now()) {
                return res.json({
                    status: "FAILED",
                    message: "Reset code has expired!"
                });
            }

            // Hash the new password
            bcrypt.hash(newPassword, 10)
                .then(hashedPassword => {
                    // Update the user's password in the User model
                    User.findByIdAndUpdate(userId, { password: hashedPassword })
                        .then(() => {
                            // Delete the reset code from the PasswordReset collection
                            passwordReset.deleteOne()
                                .then(() => {
                                    return res.json({
                                        status: "SUCCESS",
                                        message: "Password updated successfully!"
                                    });
                                })
                                .catch(err => {
                                    console.error(err);
                                    return res.json({
                                        status: "FAILED",
                                        message: "An error occurred while removing the reset code!"
                                    });
                                });
                        })
                        .catch(err => {
                            console.error(err);
                            return res.json({
                                status: "FAILED",
                                message: "An error occurred while updating the password!"
                            });
                        });
                })
                .catch(err => {
                    console.error(err);
                    return res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing the password!"
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while verifying the reset code!"
            });
        });
});

module.exports = router;