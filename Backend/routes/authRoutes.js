import express from "express";
import jwt from "jsonwebtoken";
import { getPool, sql } from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            !username.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                message: "Username and password are required.",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                message: "Server authentication configuration error.",
            });
        }

        const pool = await getPool();

        const result = await pool
            .request()
            .input("Username", sql.NVarChar(100), username.trim())
            .query(`
                SELECT
                    UserID,
                    Username,
                    Designation,
                    Circle,
                    District,
                    PasswordHash,
                    IsActive
                FROM dbo.Users
                WHERE Username = @Username;
            `);

        const user = result.recordset[0];

        if (!user || !user.IsActive) {
            return res.status(401).json({
                message: "Invalid username or password.",
            });
        }

        // Temporary development approach:
        // Compare the submitted password directly with the stored value.
        const storedPassword = String(user.PasswordHash ?? "");
        const passwordMatches = password === storedPassword;

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid username or password.",
            });
        }

        const token = jwt.sign(
            {
                userId: user.UserID,
                username: user.Username,
                designation: user.Designation,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m",
            }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                userId: user.UserID,
                username: user.Username,
                designation: user.Designation,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Unable to process login.",
        });
    }
});




router.get("/me", authenticateToken, async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request()
            .input("UserID", sql.Int, req.user.userId)
            .query(`
                SELECT
                    UserID,
                    FirstName,
                    MiddleName,
                    Surname,
                    Username,
                    Mobile,
                    Email,
                    Designation,
                    Circle,
                    District,
                    IsActive
                FROM dbo.Users
                WHERE UserID = @UserID;
            `);

        const user = result.recordset[0];

        if (!user || user.IsActive !== true) {
            return res.status(401).json({
                message: "Account is inactive or no longer exists."
            });
        }

        return res.json({
            message: "Authenticated successfully.",
            user: {
                userId: user.UserID,
                firstName: user.FirstName,
                middleName: user.MiddleName,
                surname: user.Surname,
                fullName: [
                    user.FirstName,
                    user.MiddleName,
                    user.Surname
                ]
                    .filter(value => value && String(value).trim())
                    .map(value => String(value).trim())
                    .join(" "),
                username: user.Username,
                mobile: user.Mobile,
                email: user.Email,
                designation: user.Designation,
                circle: user.Circle,
                district: user.District,
                status: user.IsActive ? "Active" : "Inactive"
            }
        });
    } catch (error) {
        console.error("Current user error:", error.message);

        return res.status(500).json({
            message: "Unable to retrieve profile information."
        });
    }
});


export default router;
