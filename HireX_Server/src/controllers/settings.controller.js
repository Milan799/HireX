const User = require("../models/Users.model");
const bcrypt = require("bcrypt");

// PUT /api/settings/change-password
const changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters." });
        }

        // Fetch the user with password (select: false on schema)
        const user = await User.findById(id).select("+password");
        if (!user) return res.status(404).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        user.password = newPassword; // Pre-save hook hashes it
        await user.save();

        return res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/settings/notifications
const updateNotificationPreferences = async (req, res) => {
    try {
        const { id } = req.user;
        const { notificationPreferences } = req.body;

        await User.findByIdAndUpdate(id, { $set: { notificationPreferences } });
        return res.status(200).json({ message: "Notification preferences updated." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE /api/settings/account
const deleteAccount = async (req, res) => {
    try {
        const { id } = req.user;
        const Application = require("../models/Applications.model");
        const Job = require("../models/Jobs.model");

        // Clean up all related data
        const userJobs = await Job.find({ employerId: id }).distinct("_id");
        await Application.deleteMany({ jobId: { $in: userJobs } });
        await Job.deleteMany({ employerId: id });
        await Application.deleteMany({ candidateId: id });
        await User.findByIdAndDelete(id);

        return res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { changePassword, updateNotificationPreferences, deleteAccount };
