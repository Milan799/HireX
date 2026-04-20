const express = require("express");
const router = express.Router();
const { getCompany, createOrUpdateCompany, uploadLogo } = require("../controllers/company.controller");
const { verifyJWT, requireRole } = require("../middlewares");
const { upload } = require("../configs/cloudinary");

router.get("/", verifyJWT, requireRole("recruiter"), getCompany);
router.post("/", verifyJWT, requireRole("recruiter"), createOrUpdateCompany);
router.put("/", verifyJWT, requireRole("recruiter"), createOrUpdateCompany);
router.post("/logo", verifyJWT, requireRole("recruiter"), upload.single("logo"), uploadLogo);

module.exports = router;
