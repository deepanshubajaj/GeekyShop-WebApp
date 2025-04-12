const express = require('express');
const Product = require('../../models/Products');
const upload = require('../helper/multerConfig');

const router = express.Router();

// PATCH route to update a product
router.patch('/', upload.single('image'), (req, res) => {
    let { title, description, price, brand, date, productId } = req.body;
    let image = null;

    if (req.file) {
        // If a file is uploaded, use the uploaded file name
        image = req.file.filename;
    } else if (req.body.image) {
        // If no new file is uploaded, use the image filename sent by the frontend
        image = req.body.image;
    }

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
        // If productId exists, we are updating an existing product using the MongoDB-generated _id
        if (productId) {
            // Update existing product by productId (_id)
            Product.findById(productId)
                .then(product => {
                    if (!product) {
                        return res.json({
                            status: "FAILED",
                            message: "Product not found"
                        });
                    }

                    // If no new image is provided, keep the existing image
                    const updatedImage = image ? image : product.image;
                    console.log("Checking updated image: ", updatedImage);

                    return Product.findByIdAndUpdate(
                        productId,
                        { title, description, price, brand, date, image: updatedImage },
                        { new: true }
                    );
                })
                .then(updatedProduct => {
                    return res.json({
                        status: "SUCCESS",
                        message: "Product updated successfully!",
                        data: updatedProduct,
                    });
                })
                .catch(err => {
                    console.error(err);
                    return res.json({
                        status: "FAILED",
                        message: "An error occurred while updating the product!"
                    });
                });
        } else {
            return res.json({
                status: "FAILED",
                message: "Product ID is required"
            });
        }
    }
});

module.exports = router;