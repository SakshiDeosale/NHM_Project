
import { getPool, sql } from "../config/db.js";

export async function requireSE(req, res, next) {
    try {
        const pool = await getPool();

        const result = await pool.request()
            .input("UserID", sql.Int, req.user.userId)
            .query(`
                SELECT Designation, IsActive
                FROM dbo.Users
                WHERE UserID = @UserID;
            `);

        const user = result.recordset[0];

        if (!user || user.IsActive !== true) {
            return res.status(403).json({
                message: "Active account required."
            });
        }

        const role = String(user.Designation || "")
            .trim()
            .toLowerCase();

        if (role !== "superintending engineer") {
            return res.status(403).json({
                message: "Only the Superintending Engineer can access Settings."
            });
        }

        next();
    } catch (error) {
        console.error("SE authorization error:", error.message);

        return res.status(500).json({
            message: "Unable to verify Settings permissions."
        });
    }
}
