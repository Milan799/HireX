const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for processing file locally in memory first (for parsing)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Basic format validation
    if (file.mimetype === "application/pdf" || file.mimetype.includes("document")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOC formats are supported"), false);
    }
  }
});

module.exports = { cloudinary, upload };
