
import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import { getPool, sql } from "../config/db.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, and WebP images are allowed."));
        }
    },
});

// GET: Display users in the table
router.get("/", async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT
                UserID, Surname, FirstName, MiddleName,
                Mobile, Email, Designation, Office, Username,
                IsActive,
                CASE WHEN PhotoData IS NOT NULL
                     THEN 1 ELSE 0 END AS HasPhoto,
                CreatedAt
            FROM dbo.Users
            WHERE IsActive = 1
            ORDER BY UserID DESC;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Fetch users error:", error.message);
        res.status(500).json({
            message: "Unable to fetch users."
        });
    }
});

// Temporary photo upload test
router.post("/upload-test", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Please upload a photo."
        });
    }

    res.json({
        status: "success",
        message: "Photo received successfully!",
        originalName: req.file.originalname,
        size: req.file.size,
        bufferReceived: Buffer.isBuffer(req.file.buffer),
    });
});

// POST: Add user and save photo
router.post("/", upload.single("photo"), async (req, res) => {
    try {
        const {
            surname, firstName, middleName, mobile,
            email, designation, office, username, password
        } = req.body;

        if (
            !surname?.trim() || !firstName?.trim() ||
            !middleName?.trim() || !mobile ||
            !email?.trim() || !designation?.trim() ||
            !office?.trim() || !username?.trim() || !password
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit mobile number."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const pool = await getPool();

        const result = await pool.request()
            .input("Surname", sql.NVarChar(100), surname.trim())
            .input("FirstName", sql.NVarChar(100), firstName.trim())
            .input("MiddleName", sql.NVarChar(100), middleName.trim())
            .input("Mobile", sql.NVarChar(10), mobile)
            .input("Email", sql.NVarChar(255), email.trim())
            .input("Designation", sql.NVarChar(100), designation.trim())
            .input("Office", sql.NVarChar(100), office.trim())
            .input("Username", sql.NVarChar(100), username.trim())
            .input("PasswordHash", sql.NVarChar(255), passwordHash)
            .input("PhotoData", sql.VarBinary(sql.MAX),
                req.file ? req.file.buffer : null)
            .query(`
                INSERT INTO dbo.Users (
                    Surname, FirstName, MiddleName, Mobile,
                    Email, Designation, Office, Username,
                    PasswordHash, PhotoData
                )
                OUTPUT INSERTED.UserID
                VALUES (
                    @Surname, @FirstName, @MiddleName, @Mobile,
                    @Email, @Designation, @Office, @Username,
                    @PasswordHash, @PhotoData
                );
            `);

        res.status(201).json({
            message: "User added successfully.",
            userID: result.recordset[0].UserID
        });
    } catch (error) {
        console.error("Create user error:", error.message);

        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: "Mobile, email, or username already exists."
            });
        }

        res.status(500).json({
            message: "Unable to add user."
        });
    }
});

// PUT: Edit an existing user
router.put("/:id", upload.single("photo"), async (req, res) => {
    try {
        const userID = Number(req.params.id);

        if (!Number.isInteger(userID) || userID <= 0) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const {
            surname, firstName, middleName, mobile,
            email, designation, office, username, password
        } = req.body;

        if (
            !surname?.trim() || !firstName?.trim() ||
            !middleName?.trim() || !mobile ||
            !email?.trim() || !designation?.trim() ||
            !office?.trim() || !username?.trim()
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit mobile number."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                message: "Enter a valid email address."
            });
        }

        const pool = await getPool();
        const request = pool.request()
            .input("UserID", sql.Int, userID)
            .input("Surname", sql.NVarChar(100), surname.trim())
            .input("FirstName", sql.NVarChar(100), firstName.trim())
            .input("MiddleName", sql.NVarChar(100), middleName.trim())
            .input("Mobile", sql.NVarChar(10), mobile)
            .input("Email", sql.NVarChar(255), email.trim())
            .input("Designation", sql.NVarChar(100), designation.trim())
            .input("Office", sql.NVarChar(100), office.trim())
            .input("Username", sql.NVarChar(100), username.trim())
            .input(
                "PasswordHash",
                sql.NVarChar(255),
                password ? await bcrypt.hash(password, 12) : null
            )
            .input(
                "PhotoData",
                sql.VarBinary(sql.MAX),
                req.file ? req.file.buffer : null
            );

        const result = await request.query(`
            UPDATE dbo.Users
            SET
                Surname = @Surname,
                FirstName = @FirstName,
                MiddleName = @MiddleName,
                Mobile = @Mobile,
                Email = @Email,
                Designation = @Designation,
                Office = @Office,
                Username = @Username,
                PasswordHash = COALESCE(@PasswordHash, PasswordHash),
                PhotoData = COALESCE(@PhotoData, PhotoData)
            WHERE UserID = @UserID AND IsActive = 1;

            SELECT @@ROWCOUNT AS RowsAffected;
        `);

        if (result.recordset[0].RowsAffected === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Update user error:", error.message);

        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: "Mobile, email, or username already exists."
            });
        }

        res.status(500).json({ message: "Unable to update user." });
    }
});


router.get("/:id/photo", async (req, res) => {
    try {
        const userID = Number(req.params.id);

        if (!Number.isInteger(userID) || userID <= 0) {
            return res.status(400).send("Invalid user ID.");
        }

        const pool = await getPool();

        const result = await pool.request()
            .input("UserID", sql.Int, userID)
            .query(`
                SELECT PhotoData
                FROM dbo.Users
                WHERE UserID = @UserID
                  AND IsActive = 1;
            `);

        if (
            result.recordset.length === 0 ||
            !result.recordset[0].PhotoData
        ) {
            return res.status(404).send("Photo not found.");
        }

        res.set("Content-Type", "image/jpeg");
        res.set("Cache-Control", "no-store");
        res.send(result.recordset[0].PhotoData);
    } catch (error) {
        console.error("Fetch photo error:", error.message);
        res.status(500).send("Unable to retrieve photo.");
    }
});


// DELETE: Soft-delete a user (preserves database history)
router.delete("/:id", async (req, res) => {
    try {
        const userID = Number(req.params.id);

        if (!Number.isInteger(userID) || userID <= 0) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input("UserID", sql.Int, userID)
            .query(`
                UPDATE dbo.Users
                SET IsActive = 0
                WHERE UserID = @UserID AND IsActive = 1;

                SELECT @@ROWCOUNT AS RowsAffected;
            `);

        if (result.recordset[0].RowsAffected === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Delete user error:", error.message);
        res.status(500).json({ message: "Unable to delete user." });
    }
});

export default router;
