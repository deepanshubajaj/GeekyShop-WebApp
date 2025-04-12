const Product = require('../../models/Products');
const cloudinary = require('./cloudinaryConfig');

// Remove extra uploaded images
const cleanupUnusedImages = async () => {
    try {
        // Get all products from the database
        const products = await Product.find();
        
        // Extract public IDs from the product images
        const existingImages = new Set(
            products.map(product => {
                const imageUrl = product.image;
                if (imageUrl) {
                    // Extract the public ID from the Cloudinary URL
                    const match = imageUrl.match(/\/v[0-9]+\/(.*)\./);
                    return match ? match[1] : null;
                }
                return null;
            }).filter(Boolean) // Remove null values (in case the match failed)
        );

        // List all images in the Cloudinary folder
        const folderName = 'uploadsGeekyShop'; 
        const cloudinaryImages = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderName,
            max_results: 500, 
        });

        let deletedCount = 0;

        // Loop through the Cloudinary images and delete those not in the database
        for (const resource of cloudinaryImages.resources) {
            const publicId = resource.public_id; 
            const imageUrl = resource.secure_url;

            if (!existingImages.has(publicId)) {
                // Delete the image from Cloudinary using its public ID
                await cloudinary.uploader.destroy(publicId); 
                console.log(`Deleted unused image: ${imageUrl}`);
                deletedCount++;
            }
        }

        // Total count of deleted images
        console.log(`Total images removed: ${deletedCount}`);

    } catch (error) {
        console.error("Error during cleanup:", error);
    }
};

module.exports = cleanupUnusedImages;
