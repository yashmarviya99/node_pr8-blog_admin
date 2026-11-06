const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
    try {
        // Get token from request header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Please Login First"
            });
        }

        // Remove Bearer from token
        const tokenData = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            tokenData,
            process.env.JWT_SECRET
        );

        // Find admin in database
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                message: "Admin Not Found"
            });
        }

        if (admin.status !== "Active") {
            return res.status(403).json({
                message: "Admin Account is Inactive"
            });
        }

        // Store admin data in request
        req.admin = admin;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token",
            error: error.message
        });
    }
};

module.exports = protectAdmin;
