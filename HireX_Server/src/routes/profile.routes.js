const express = require("express");
const { getProfile, updateProfile, uploadPhoto } = require("../controllers/profile.controller");
const { verifyJWT } = require("../middlewares");
const { upload } = require("../configs/cloudinary");

const profileRouter = express.Router();

profileRouter.get("/", verifyJWT, getProfile);
profileRouter.put("/", verifyJWT, updateProfile);
profileRouter.post("/upload-photo", verifyJWT, upload.single("avatar"), uploadPhoto);

module.exports = profileRouter;
