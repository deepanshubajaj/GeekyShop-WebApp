const express = require('express');
const Product = require('../../models/Products');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// DELETE route to remove a product by its ID
router.delete('/', (req, res) => {
    const { productId } = req.body;  // Extract productId from the request body

    // Validate if productId is provided
    if (!productId) {
        return res.json({
            status: "FAILED",
            message: "Product ID is required!"
        });
    }

    // Find the product to get its image path before deletion
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.json({
                    status: "FAILED",
                    message: "Product not found!"
                });
            }

            // Image path (if it exists)
            const imagePath = product.image ? path.join(__dirname, '..', 'uploads', product.image) : null;

            // Delete the product from the database
            return Product.findByIdAndDelete(productId)
                .then(deletedProduct => {
                    // If the product has an image, delete the image file
                    if (imagePath && fs.existsSync(imagePath)) {
                        // Delete the file from the filesystem
                        fs.unlinkSync(imagePath);
                    }

                    return res.json({
                        status: "SUCCESS",
                        message: "Product deleted successfully!",
                        data: deletedProduct
                    });
                });
        })
        .catch(err => {
            console.error(err);
            return res.json({
                status: "FAILED",
                message: "An error occurred while deleting the product!"
            });
        });
});

module.exports = router;