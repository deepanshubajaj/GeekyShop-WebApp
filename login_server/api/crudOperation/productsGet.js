const express = require('express');
const Product = require('../../models/Products');

const router = express.Router();

// GET route to fetch all products
router.get('/', (req, res) => {
    // Fetch all products from the Product model
    Product.find()
        .then(products => {
            if (products.length === 0) {
                return res.json({
                    status: "FAILED",
                    message: "No products found."
                });
            } else {
                return res.json({
                    status: "SUCCESS",
                    message: "Products fetched successfully.",
                    data: products
                });
            }
        })
        .catch(err => {
            console.error(err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while fetching the products."
            });
        });
});

module.exports = router;