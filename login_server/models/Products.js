const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: false }, // Optional image field
  },
  { timestamps: true }
);

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
