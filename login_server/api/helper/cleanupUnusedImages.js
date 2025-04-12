const Product = require('../../models/Products');
const path = require('path');
const fs = require('fs');

// Remove extra uploaded images
const cleanupUnusedImages = async () => {
    try {
        // Get all products from the database
        const products = await Product.find();
        const existingImages = new Set(products.map(product => product.image).filter(image => image));

        // Read the uploads directory
        const uploadDir = path.join(__dirname, './../../uploads');
        const files = fs.readdirSync(uploadDir);

        // Initialize a counter for deleted images
        let deletedCount = 0;

        // Loop through the files and delete those not in the database
        for (const file of files) {
            if (!existingImages.has(file)) {
                const filePath = path.join(uploadDir, file);
                fs.unlinkSync(filePath); // Delete the file
                console.log(`Deleted unused image: ${file}`);
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