const express = require("express");
const router = express.Router();
const { uploadAndParseResume } = require("../controllers/resume.controller");
const { verifyJWT, requireRole } = require("../middlewares");
const { upload } = require("../configs/cloudinary");

router.post("/upload", verifyJWT, requireRole("candidate"), upload.single("resume"), uploadAndParseResume);

module.exports = router;
