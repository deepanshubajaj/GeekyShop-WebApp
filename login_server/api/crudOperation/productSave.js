const express = require('express');
const Product = require('../../models/Products');
const upload = require('../helper/multerConfig');

const router = express.Router();

// POST route to save a new product
router.post('/', upload.single('image'), (req, res) => {
    let { title, description, price, brand, date } = req.body;
    const image = req.file ? req.file.filename : null;

    // Trim input data
    title = title.trim();
    description = description.trim();
    brand = brand.trim();
    date = date.trim();

    // Validate input fields
    if (title === "" || description === "" || price === "" || brand === "" || date === "") {
        return res.json({
            status: "FAILED",
            message: "Empty Input Fields!"
        });
    } else if (price <= 0 || isNaN(price)) {
        return res.json({
            status: "FAILED",
            message: "Invalid price entered"
        });
    } else if (!new Date(date).getTime()) {
        return res.json({
            status: "FAILED",
            message: "Invalid date entered"
        });
    } else {
        // Check if the product already exists
        Product.find({ title }).then(result => {
            if (result.length) {
                return res.json({
                    status: "FAILED",
                    message: "Product with the provided title already exists!"
                });
            } else {
                // Create a new product for products
                const newProduct = new Product({
                    title,
                    description,
                    price,
                    brand,
                    date,
                    image,
                });

                // Save the new product only in the 'products' collection
                newProduct.save()
                    .then(savedProduct => {
                        return res.json({
                            status: "SUCCESS",
                            message: "Product saved successfully!",
                            data: savedProduct,
                        });
                    }).catch(err => {
                        console.error(err);
                        return res.json({
                            status: "FAILED",
                            message: "An error occurred while saving the product!"
                        });
                    });
            }
        }).catch(err => {
            console.error(err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing product!"
            });
        });
    }
});

module.exports = router;