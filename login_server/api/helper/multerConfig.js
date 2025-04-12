const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for image uploads (optional)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Folder where images will be saved
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        // Save image with a unique timestamp
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Make sure the 'uploads' directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

module.exports = upload;