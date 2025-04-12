const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: "auto",
        folder: 'uploadsGeekyShop', // The name of the folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed formats
    },
});

// Set up multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;