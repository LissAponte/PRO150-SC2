const User = require('../models/User');

// Require a logged-in user (session-based)
exports.protect = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(req.session.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Auth error" });
    }
};

// Only admins can access
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Not authorized as admin" });
};

