const express = require('express');
const Product = require('../../models/Products');
const upload = require('../helper/multerConfig');
const cloudinary = require('../helper/cloudinaryConfig'); 

const router = express.Router();

// PATCH route to update a product
router.patch('/', upload.single('image'), async (req, res) => {
    let { title, description, price, brand, date, productId } = req.body;
    let image = null;

    if (req.file) {
        // If a file is uploaded, use the uploaded file URL from Cloudinary
        image = req.file.path; 
    } else if (req.body.image) {
        // If no new file is uploaded, use the existing image URL sent by the frontend
        image = req.body.image;
    }

    // Trim input data
    title = title.trim();
    description = description.trim();
    brand = brand.trim();
    date = date.trim();

    // Validate input fields
    if (!title || !description || !price || !brand || !date) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty Input Fields!"
        });
    } else if (price <= 0 || isNaN(price)) {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid price entered"
        });
    } else if (!new Date(date).getTime()) {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid date entered"
        });
    }

    if (!productId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Product ID is required"
        });
    }

    try {
        // Find the existing product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: "FAILED",
                message: "Product not found"
            });
        }

        // If a new image is provided, delete the old image from Cloudinary
        if (req.file) {
            const oldImagePublicId = product.image.split('/').pop().split('.')[0]; 
            await cloudinary.uploader.destroy(oldImagePublicId); 
        }

        // Update the product with new data
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { title, description, price, brand, date, image: image || product.image },
            { new: true }
        );

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product updated successfully!",
            data: updatedProduct,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while updating the product!"
        });
    }
});

module.exports = router;