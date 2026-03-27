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

module.exports = { verifyJWT, verifyResetToken, requireRole, requireAdmin };
