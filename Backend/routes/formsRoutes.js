
import express from "express";
import { getPool, sql } from "../config/db.js";

import nhmConfig from "../scheme-config/nhmConfig.js";
import fifteenthFinanceConfig from "../scheme-config/FifteenthFinanceConfig.js";
import pmAbhimConfig from "../scheme-config/pm-abhimConfig.js";
import pmjvkConfig from "../scheme-config/pmjvkConfig.js";
import ayushConfig from "../scheme-config/ayushConfig.js";
import adbConfig from "../scheme-config/adbConfig.js";
import ndbConfig from "../scheme-config/ndbConfig.js";

const router = express.Router();

// Only these configured schemes can be accessed.
const schemeConfigs = {
    nhm: nhmConfig,
    "15th-fc": fifteenthFinanceConfig,
    "pm-abhim": pmAbhimConfig,
    pmjvk: pmjvkConfig,
    ayush: ayushConfig,
    adb: adbConfig,
    ndb: ndbConfig,
};

function getSchemeConfig(req, res) {
    const scheme = String(req.query.scheme || "nhm")
        .trim()
        .toLowerCase();

    const config = schemeConfigs[scheme];

    if (!config) {
        res.status(400).json({
            success: false,
            message: `Invalid scheme: ${scheme}`,
        });
        return null;
    }

    return config;
}

// Read actual columns from the selected table.
// Table names come only from the trusted scheme configuration.
async function getTableColumns(pool, table) {
    const result = await pool
        .request()
        .input("tableName", sql.NVarChar(128), table)
        .query(`
            SELECT
                COLUMN_NAME,
                COLUMNPROPERTY(
                    OBJECT_ID(
                        QUOTENAME(TABLE_SCHEMA) + '.' +
                        QUOTENAME(TABLE_NAME)
                    ),
                    COLUMN_NAME,
                    'IsIdentity'
                ) AS IsIdentity
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'dbo'
              AND TABLE_NAME = @tableName
            ORDER BY ORDINAL_POSITION;
        `);

    return result.recordset;
}

// GET: Next serial number for the selected scheme.
// Example: GET /api/forms/next-sr-no?scheme=pmjvk
router.get("/next-sr-no", async (req, res) => {
    try {
        const config = getSchemeConfig(req, res);
        if (!config) return;

        const pool = await getPool();
        const columns = await getTableColumns(pool, config.table);

        const srNoColumn = columns.find(
            (column) =>
                column.COLUMN_NAME.toLowerCase() === "srno"
        );

        if (!srNoColumn) {
            return res.status(400).json({
                success: false,
                message: `The dbo.${config.table} table does not contain an SrNo column.`,
            });
        }

        const tableName = `[dbo].[${config.table}]`;

        const result = await pool.request().query(`
            SELECT
                ISNULL(
                    MAX(TRY_CONVERT(INT, [${srNoColumn.COLUMN_NAME}])),
                    0
                ) + 1 AS srNo
            FROM ${tableName};
        `);

        return res.json({
            success: true,
            srNo: result.recordset[0].srNo,
        });
    } catch (error) {
        console.error("Next serial number error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate the next serial number.",
        });
    }
});

// POST: Save form data into the selected scheme table.
// Example: POST /api/forms?scheme=pmjvk
router.post("/", async (req, res) => {
    try {
        const config = getSchemeConfig(req, res);
        if (!config) return;

        const pool = await getPool();
        const tableName = `[dbo].[${config.table}]`;
        const formData = req.body || {};

        // Validate required fields.
        for (const field of config.requiredFields || []) {
            const value = formData[field];

            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required.`,
                });
            }
        }

        const columns = await getTableColumns(pool, config.table);

        if (columns.length === 0) {
            return res.status(400).json({
                success: false,
                message: `Table dbo.${config.table} was not found or has no columns.`,
            });
        }

        const actualColumnNames = new Set(
            columns.map((column) => column.COLUMN_NAME.toLowerCase())
        );

        // Map frontend field names to real SQL column names.
        const insertFields = [];

        for (const [formKey, dbColumn] of Object.entries(
            config.fieldToColumn
        )) {
            if (!Object.prototype.hasOwnProperty.call(formData, formKey)) {
                continue;
            }

            const actualColumn = columns.find(
                (column) =>
                    column.COLUMN_NAME.toLowerCase() ===
                    dbColumn.toLowerCase()
            );

            // Do not insert into columns that do not exist or are identities.
            if (
                !actualColumn ||
                actualColumn.IsIdentity === 1
            ) {
                continue;
            }

            // Avoid inserting blank values for identity-like or generated fields.
            insertFields.push({
                formKey,
                dbColumn: actualColumn.COLUMN_NAME,
                value: formData[formKey],
            });
        }

       

        if (insertFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: `No matching form fields were found for dbo.${config.table}. Check fieldToColumn in the scheme config.`,
            });
        }

        // Prevent duplicate work IDs when this table has a mapped workId column.
        const workIdField = insertFields.find(
            (field) => field.formKey === "workId"
        );

        if (workIdField) {
            const duplicateResult = await pool
                .request()
                .input(
                    "workId",
                    sql.NVarChar(sql.MAX),
                    String(workIdField.value).trim()
                )
                .query(`
                    SELECT TOP 1 1 AS found
                    FROM ${tableName}
                    WHERE TRY_CONVERT(
                        NVARCHAR(MAX), [${workIdField.dbColumn}]
                    ) = @workId;
                `);

            if (duplicateResult.recordset.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "This Work ID already exists in this scheme.",
                });
            }
        }

        // Build a parameterized INSERT query.
        const request = pool.request();

        const columnSql = [];
        const valueSql = [];

        insertFields.forEach((field, index) => {
            const parameterName = `value${index}`;

            columnSql.push(`[${field.dbColumn}]`);
            valueSql.push(`@${parameterName}`);

            // Convert empty form values to NULL.
            const value =
                field.value === "" || field.value === undefined
                    ? null
                    : field.value;

            request.input(
                parameterName,
                sql.NVarChar(sql.MAX),
                value === null ? null : String(value)
            );
        });

        const insertQuery = `
            INSERT INTO ${tableName}
                (${columnSql.join(", ")})
            OUTPUT INSERTED.*
            VALUES
                (${valueSql.join(", ")});
        `;

        const result = await request.query(insertQuery);

        return res.status(201).json({
            success: true,
            message: `Data saved successfully in dbo.${config.table}.`,
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Form submission error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save form data.",
            error: error.message,
        });
    }
});

export default router;
