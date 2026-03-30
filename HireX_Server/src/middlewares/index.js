const jwt = require("jsonwebtoken");

/**
 * Verify JWT access token middleware
 */
const verifyJWT = (req, res, next) => {
  try {
    // Read token from cookies (recommended)
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    // Token missing
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    // Attach user info to request (role is required by all employer/candidate guards)
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

const verifyResetToken = (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Reset token missing. Please request a new OTP." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Reset Token Verification Error:", error);
    return res.status(401).json({ message: "Your reset session has expired. Please request a new code." });
  }
};

/**
 * Middleware to check specific roles
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
    }
    next();
  };
};

/**
 * Middleware for Admins
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

/**
 * Middleware to check Daily Interview scheduling limit for Recruiters
 */
const checkInterviewLimit = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Only intercept when scheduling an Interview
    if (status !== "Interview") {
      return next();
    }

    const User = require("../models/Users.model");
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const lastReset = currentUser.usage?.lastResetDate ? new Date(currentUser.usage.lastResetDate) : new Date();

    let interviewsToday = currentUser.usage?.interviewsToday || 0;
    // Reset counter if calendar day shifted
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      interviewsToday = 0;
    }

    const limit = currentUser.subscription?.interviewsPerDayLimit || 3;
    if (interviewsToday >= limit) {
      return res.status(402).json({ message: `Daily interview limit (${limit}) reached. Upgrade your plan or wait until tomorrow.` });
    }

    // Pass the calculated usage variables downstream so controller can increment safely
    req.interviewsTodayToIncrement = interviewsToday + 1;
    req.usageDateToSet = now;

    next();
  } catch (error) {
    console.error("Interview Usage Middleware Error:", error);
    res.status(500).json({ message: "System error checking plan limits" });
  }
};

module.exports = { verifyJWT, verifyResetToken, requireRole, requireAdmin, checkInterviewLimit };
