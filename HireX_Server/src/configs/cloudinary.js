const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Base directory outside HireX folder entirely
const baseUploadDir = path.join(__dirname, '../../../uploads');

// Configure Multer for processing file locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subFolder = "misc";
    if (file.fieldname === "avatar") subFolder = "avatar";
    else if (file.fieldname === "resume") subFolder = "resumes";

    const targetDir = path.join(baseUploadDir, subFolder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.includes("document") || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and Image (JPG/PNG) formats are supported"), false);
    }
  }
});

module.exports = { upload };
