const User = require("../models/Users.model");

// GET /api/profile
// Get user profile by ID or by role for Recruiter search (Resdex)
const getProfile = async (req, res) => {
    try {
        const { role, keyword } = req.query;

        // If query has role=candidate and keyword, handle Resdex search
        if (role === "candidate") {
            // SECURITY PATCH: Ensure only verified recruiters can search the candidate database
            if (req.user.role !== "recruiter") {
                return res.status(403).json({ message: "Only Recruiters are verified to search candidate directories." });
            }

            const query = { role: "candidate" };
            if (keyword) {
                query.$or = [
                    { skills: { $regex: keyword, $options: "i" } },
                    { fullName: { $regex: keyword, $options: "i" } },
                    { "experience.title": { $regex: keyword, $options: "i" } },
                    { "experience.company": { $regex: keyword, $options: "i" } },
                ];
            }
            if (req.query.location) {
                query["location.city"] = { $regex: req.query.location, $options: "i" };
            }
            if (req.query.experience && req.query.experience !== "Any") {
                query["experience.years"] = { $regex: req.query.experience, $options: "i" };
            }
            const users = await User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(50);
            return res.status(200).json({ users });
        }

        // Otherwise return the authenticated user's profile
        const { id } = req.user;
        const user = await User.findById(id).select("-password").populate("companyId");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/profile
// Update user profile array fields dynamically
const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updates = req.body;

        // Ensure immutable fields are not changed here
        delete updates.email;
        delete updates.password;
        delete updates.role;
        delete updates.isVerified;

        Object.assign(user, updates);
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/profile/upload-photo
const uploadPhoto = async (req, res) => {
    try {
        const { id } = req.user;
        if (!req.file) return res.status(400).json({ error: "No file provided" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.profilePicture = `/uploads/avatar/${req.file.filename}`;
        await user.save();

        res.status(200).json({ message: "Photo uploaded", profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadPhoto
};
