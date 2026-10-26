
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required. Please log in.",
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            message: "Server authentication configuration error.",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (
            !decoded ||
            typeof decoded !== "object" ||
            !decoded.userId
        ) {
            return res.status(401).json({
                message: "Invalid authentication token.",
            });
        }

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            designation: decoded.designation,
            circle: decoded.circle ?? null,
            district: decoded.district ?? null,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message:
                error.name === "TokenExpiredError"
                    ? "Your session has expired. Please log in again."
                    : "Invalid authentication token.",
        });
    }
}
