const express = require("express");
const router = express.Router();
const { getCompany, createOrUpdateCompany } = require("../controllers/company.controller");
const { verifyJWT, requireRole } = require("../middlewares");

router.get("/", verifyJWT, requireRole("recruiter"), getCompany);
router.post("/", verifyJWT, requireRole("recruiter"), createOrUpdateCompany);
router.put("/", verifyJWT, requireRole("recruiter"), createOrUpdateCompany);

module.exports = router;
