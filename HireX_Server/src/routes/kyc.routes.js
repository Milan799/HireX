const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kyc.controller");
const { upload } = require("../configs/cloudinary");
const { verifyJWT, requireAdmin } = require("../middlewares");

// Recruiter Paths
router.post("/submit", verifyJWT, upload.single("verificationDocument"), kycController.submitKyc);
router.get("/status", verifyJWT, kycController.getKycStatus);

// Admin Paths
router.get("/admin/pending", verifyJWT, requireAdmin, kycController.getPendingKycList);
router.put("/admin/evaluate/:docId", verifyJWT, requireAdmin, kycController.evaluateKyc);

module.exports = router;
