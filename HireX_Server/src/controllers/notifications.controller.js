const Notification = require("../models/Notification.model");

// GET /api/notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
        return res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, error: "Notification not found" });
        }

        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        return res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/notifications/clear-all
const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.deleteMany({ userId });
        return res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
};
