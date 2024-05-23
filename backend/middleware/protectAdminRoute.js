import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

// Middleware to protect admin routes
export const protectAdminRoute = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains admin information
        if (!decoded || !decoded.adminId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Fetch the admin from the database
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(401).json({ error: "Unauthorized: Admin not found" });
        }

        // Attach the admin object to the request
        req.admin = admin;

        // Move to the next middleware
        next();
    } catch (error) {
        console.error("Error in protectAdminRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
