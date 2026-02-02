import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify JWT token
export const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header first, then cookie
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ error: "Not authorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ error: "Not authorized - Invalid token" });
    }
};

// Check user role - only allow specified roles
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Not authorized - Required role: ${allowedRoles.join(" or ")}`
            });
        }

        next();
    };
};
