const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const { verifyJWT } = require("../middlewares/index");

router.post("/create-order", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);

module.exports = router;
