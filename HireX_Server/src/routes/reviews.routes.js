const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares");
const { addReview, getCompanyReviews } = require("../controllers/reviews.controller");

router.get("/company/:id", getCompanyReviews); // Public/Logged-in access
router.post("/", verifyJWT, addReview); // Requires authentication

module.exports = router;
