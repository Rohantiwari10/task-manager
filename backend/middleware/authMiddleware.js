const jwt = require("jsonwebtoken");

// Middleware that verifies the JWT sent by the client
const authenticateToken = (req, res, next) => {
    try {
        // Read the Authorization header
        const authHeader = req.headers.authorization;

        // Expected format:
        // Authorization: Bearer <token>
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token required"
            });
        }

        // Remove "Bearer " and keep only the token
        const token = authHeader.split(" ")[1];

        // Verify token using the same secret used during login
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information for later controllers
        req.user = decoded;

        // Token is valid → continue to the next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;