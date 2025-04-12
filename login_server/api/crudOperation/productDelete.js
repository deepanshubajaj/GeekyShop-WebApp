const express = require('express');
const Product = require('../../models/Products');
const cloudinary = require('./../helper/cloudinaryConfig');

const router = express.Router();

// DELETE route to remove a product by its ID
router.delete('/', (req, res) => {
    const { productId } = req.body;  

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

            // Get the public ID of the image
            const imageUrl = product.image;
            const publicId = imageUrl.split('/').pop().split('.')[0]; 

            // Delete the product from the database
            return Product.findByIdAndDelete(productId)
                .then(deletedProduct => {
                    // If the product has an image, delete the image from Cloudinary
                    if (imageUrl) {
                        return cloudinary.uploader.destroy(publicId)
                            .then(() => {
                                return res.json({
                                    status: "SUCCESS",
                                    message: "Product deleted successfully!",
                                    data: deletedProduct
                                });
                            });
                    } else {
                        return res.json({
                            status: "SUCCESS",
                            message: "Product deleted successfully!",
                            data: deletedProduct
                        });
                    }
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