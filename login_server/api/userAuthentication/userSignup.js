const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

// POST route for Signup
router.post('/', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;

    // Trim input data
    name = name.trim()
    email = email.trim()
    password = password.trim()
    dateOfBirth = dateOfBirth.trim()

    // Validate input fields
    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty Input Fields!"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid Date Of Birth entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {

        // Check if user already exists
        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists!"
                })
            } else {
                // Try to create new user

                // Password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup Successful",
                            data: result,
                        })
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving user account!"
                            })
                        })
                })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while hashing password!"
                        })
                    })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
    }

})

module.exports = router;