
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getPool, sql } from "../config/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username?.trim() || !password) {
            return res.status(400).json({
                message: "Username and password are required.",
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "Server authentication configuration error.",
            });
        }

        const pool = await getPool();

        const result = await pool
            .request()
            .input("Username", sql.NVarChar(100), username.trim())
            .query(`
        SELECT UserID, Username, Designation, PasswordHash, IsActive
        FROM dbo.Users
        WHERE Username = @Username;
      `);

        const user = result.recordset[0];

        if (!user || !user.IsActive) {
            return res.status(401).json({
                message: "Invalid username or password.",
            });
        }

        const storedPassword = user.PasswordHash ?? "";
        let passwordMatches;

        if (/^\$2[aby]\$/.test(storedPassword)) {
            passwordMatches = await bcrypt.compare(
                password,
                storedPassword
            );
        } else {
            passwordMatches = password === storedPassword;
        }

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
            { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
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

export default router;
