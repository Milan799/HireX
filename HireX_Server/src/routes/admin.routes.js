const express = require("express");
const router = express.Router();
const { 
    getPlatformStats,
    getAllUsers,
    deleteUser,
    getAllEmployers,
    deleteEmployer,
    getAllJobs,
    deleteJob,
    getAllMessages,
    deleteMessage
} = require("../controllers/admin.controller");
const { verifyJWT, requireAdmin } = require("../middlewares");

// Admin Platform Stats
router.get("/stats", verifyJWT, requireAdmin, getPlatformStats);

// User Management
router.get("/users", verifyJWT, requireAdmin, getAllUsers);
router.delete("/users/:id", verifyJWT, requireAdmin, deleteUser);

// Employer/Company Management
router.get("/employers", verifyJWT, requireAdmin, getAllEmployers);
router.delete("/employers/:id", verifyJWT, requireAdmin, deleteEmployer);

// Job Management
router.get("/jobs", verifyJWT, requireAdmin, getAllJobs);
router.delete("/jobs/:id", verifyJWT, requireAdmin, deleteJob);

// Contact Message Management
router.get("/messages", verifyJWT, requireAdmin, getAllMessages);
router.delete("/messages/:id", verifyJWT, requireAdmin, deleteMessage);

module.exports = router;
