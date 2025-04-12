const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const cleanupUnusedImages = require('../helper/cleanupUnusedImages')

const router = express.Router();

// POST route for Login
router.post('/', (req, res) => {
    let { email, password } = req.body;

    // Trim input data
    email = email.trim()
    password = password.trim()

    // Validate input fields
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied!"
        });
    } else {
        // Check if user exist
        User.find({ email })
            .then(data => {
                if (data.length) {
                    // User exists

                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            // Password Match

                            // Calling cleanup function here to remove unused images
                            cleanupUnusedImages();

                            res.json({
                                status: "SUCCESS",
                                message: "Signin Successful",
                                data: data
                            })
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid Password entered"
                            })
                        }
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing passwords"
                            })
                        })

                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered!"
                    })
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user"
                })
            })
    }

})

module.exports = router;