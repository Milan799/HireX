const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.controller");
const { verifyJWT } = require("../middlewares");

const profileRouter = express.Router();

profileRouter.get("/", verifyJWT, getProfile);
profileRouter.put("/", verifyJWT, updateProfile);

module.exports = profileRouter;
