const express = require("express");
const { changePassword, updateNotificationPreferences, deleteAccount } = require("../controllers/settings.controller");
const { verifyJWT } = require("../middlewares");

const settingsRouter = express.Router();

settingsRouter.put("/change-password", verifyJWT, changePassword);
settingsRouter.put("/notifications", verifyJWT, updateNotificationPreferences);
settingsRouter.delete("/account", verifyJWT, deleteAccount);

module.exports = settingsRouter;
