const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares");
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
} = require("../controllers/notifications.controller");

router.use(verifyJWT);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/clear-all", clearAllNotifications);

module.exports = router;
