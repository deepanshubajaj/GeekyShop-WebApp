const express = require('express');
const router = express.Router();

// Authentication variables
const signupRoute = require('./userAuthentication/userSignup');
const loginRoute = require('./userAuthentication/userLogin');
const forgotPass = require('./userAuthentication/passwordForgot');
const resetPass = require('./userAuthentication/passwordReset');

// CRUD operations variables
const prodDelete = require('./crudOperation/productDelete');
const prodSave = require('./crudOperation/productSave');
const prodGet = require('./crudOperation/productsGet');
const prodUpdate = require('./crudOperation/productUpdate');

// Contact Form variables
const contact_Form = require('./contactForm/contactDeveloper');

// ------------------------------------------------------------------------------
// Following are the routes required:

// Authentication Router
router.use('/signup', signupRoute);
router.use('/login', loginRoute);
router.use('/forgot-password', forgotPass);
router.use('/reset-password', resetPass);

// CRUD Operation Router
router.use('/delete-product', prodDelete);
router.use('/save-product', prodSave);
router.use('/get-products', prodGet);
router.use('/update-product', prodUpdate);

// Contact Form Router
router.use('/contact-form', contact_Form);

module.exports = router;