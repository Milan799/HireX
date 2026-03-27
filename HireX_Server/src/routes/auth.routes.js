const express = require("express");
const { loginUser, registerUser, sendForgotPasswordEmail, verifyOTP, resetPassword } = require("../controllers/auth.controller");
const { verifyResetToken } = require("../middlewares");

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/request-otp", sendForgotPasswordEmail);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", verifyResetToken, resetPassword);

module.exports = authRouter;    