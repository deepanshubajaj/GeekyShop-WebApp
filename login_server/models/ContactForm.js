const mongoose = require('mongoose');

// ContactForm Schema
const contactFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },  
    time: { type: String, required: true }    
});

// Create the ContactForm model
const ContactForm = mongoose.model('ContactForm', contactFormSchema);

module.exports = ContactForm;
