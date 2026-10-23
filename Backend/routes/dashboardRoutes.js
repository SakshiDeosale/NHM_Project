import express from "express";
import { getPool } from "../config/db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);

const schemes = [
    { id: "nhm", name: "NHM", table: "NHM" },
    { id: "15th-fc", name: "15th Finance", table: "15th_Finance" },
    { id: "pm-abhim", name: "PM-ABHIM", table: "PM-ABHIM" },
    { id: "pmjvk", name: "PMJVK", table: "PMJVK" },
    { id: "ayush", name: "AYUSH", table: "AYUSH" },
    { id: "adb", name: "ADB", table: "ADB" },
    { id: "ndb", name: "NDB", table: "NDB" },
];

router.get("/scheme-status", async (req, res) => {
    try {
        const pool = await getPool();

        const users = await Promise.all(
            schemes.map(async (scheme) => {
                // Check whether the table contains ActualStatus.
                const columnCheck = await pool
                    .request()
                    .input("tableName", scheme.table)
                    .query(`
            SELECT COUNT(*) AS columnCount
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'dbo'
              AND TABLE_NAME = @tableName
              AND COLUMN_NAME = 'ActualStatus'
          `);

                if (columnCheck.recordset[0].columnCount === 0) {
                    throw new Error(
                        `ActualStatus column not found in dbo.${scheme.table}`
                    );
                }

                // Table name comes only from the predefined scheme list.
                const result = await pool.request().query(`
          SELECT
            COALESCE(SUM(CASE
              WHEN UPPER(LTRIM(RTRIM(ISNULL(ActualStatus, ''))))
                   IN ('COMPLETE', 'COMPLETED')
              THEN 1 ELSE 0
            END), 0) AS COMPLETE,

            COALESCE(SUM(CASE
              WHEN UPPER(LTRIM(RTRIM(ISNULL(ActualStatus, ''))))
                   IN ('PROGRESS', 'IN PROGRESS')
              THEN 1 ELSE 0
            END), 0) AS PROGRESS,

            COALESCE(SUM(CASE
              WHEN UPPER(LTRIM(RTRIM(ISNULL(ActualStatus, ''))))
                   = 'NOT STARTED'
              THEN 1 ELSE 0
            END), 0) AS [NOT STARTED],

            COALESCE(SUM(CASE
              WHEN UPPER(LTRIM(RTRIM(ISNULL(ActualStatus, ''))))
                   = 'CANCELLED'
              THEN 1 ELSE 0
            END), 0) AS CANCELLED,

            COUNT(*) AS TOTAL
          FROM [dbo].[${scheme.table}]
        `);

                return {
                    id: scheme.id,
                    name: scheme.name,
                    ...result.recordset[0],
                };
            })
        );

        res.json({ success: true, data: users });
    } catch (error) {
        console.error("Scheme status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch scheme status.",
            error: error.message,
        });
    }
});

export default router;
