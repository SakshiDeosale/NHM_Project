import express from 'express';
import { getPool, sql } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken);

// Map each URL scheme identifier to its SQL Server table.
// Replace the five placeholder names with your actual table names.
const schemeTables = {
    nhm: 'NHM',
    '15th-finance': '15th_Finance',
    'pm-abhim': 'PM-ABHIM',
    pmjvk: 'PMJVK',
    ayush: 'AYUSH',
    adb: 'ADB',
    ndb: 'NDB'
};

// Only allow predefined table names.
function getSchemeTable(scheme) {
    const tableName = schemeTables[scheme];

    if (!tableName || tableName.startsWith('REPLACE_')) {
        const error = new Error(
            `Database table is not configured for scheme: ${scheme || 'missing'}`
        );
        error.statusCode = 400;
        throw error;
    }

    return `[dbo].[${tableName}]`;
}



const getReportScope = async (pool, userId) => {
    const result = await pool.request()
        .input("UserID", sql.Int, userId)
        .query(`
            SELECT
                UserID,
                FirstName,
                MiddleName,
                Surname,
                Designation,
                Circle,
                District,
                IsActive
            FROM dbo.Users
            WHERE UserID = @UserID;
        `);

    const user = result.recordset[0];

    if (!user || user.IsActive !== true) {
        const error = new Error("User account is inactive or unavailable.");
        error.statusCode = 403;
        throw error;
    }

    const role = String(user.Designation || "")
        .trim()
        .toLowerCase();

    const name = [
        user.FirstName,
        user.MiddleName,
        user.Surname
    ]
        .filter(value => value && String(value).trim())
        .map(value => String(value).trim())
        .join(" ");

    if (role === "superintending engineer") {
        return { role, name, circle: null, district: null };
    }

    const circleRoles = [
        "executive engineer",
        "deputy engineer",
        "junior engineer"
    ];

    if (circleRoles.includes(role)) {
        return {
            role,
            name,
            circle: user.Circle
                ? String(user.Circle).trim()
                : null,
            district: user.District
                ? String(user.District).trim()
                : null
        };
    }

    if (["mla", "mp", "contractor"].includes(role)) {
        return {
            role,
            name,
            circle: user.Circle
                ? String(user.Circle).trim()
                : null,
            district: user.District
                ? String(user.District).trim()
                : null
        };
    }

    const error = new Error("This role is not authorized to view reports.");
    error.statusCode = 403;
    throw error;
};


const applyReportScope = (scope, request, conditions) => {
    // SE can access all records.
    if (scope.role === "superintending engineer") {
        return;
    }

    const addNameCondition = (columns) => {
        if (!scope.name) {
            const error = new Error(
                "The logged-in user's name is missing."
            );
            error.statusCode = 403;
            throw error;
        }

        const nameParameter = "assignedName";

        request.input(
            nameParameter,
            sql.NVarChar(255),
            scope.name
        );

        conditions.push(
            `(${columns.map(column =>
                `LTRIM(RTRIM([${column}])) = @${nameParameter}`
            ).join(" OR ")})`
        );
    };

    if (scope.role === "executive engineer") {
        const access = [];

        if (scope.circle) {
            access.push("[Circle] = @assignedCircle");
            request.input(
                "assignedCircle",
                sql.NVarChar(255),
                scope.circle
            );
        }

        if (scope.name) {
            request.input(
                "assignedName",
                sql.NVarChar(255),
                scope.name
            );
            access.push("LTRIM(RTRIM([EEName])) = @assignedName");
        }

        if (!access.length) {
            const error = new Error(
                "No Circle or name is assigned to this user."
            );
            error.statusCode = 403;
            throw error;
        }

        conditions.push(`(${access.join(" OR ")})`);
        return;
    }

    if (scope.role === "deputy engineer" ||
        scope.role === "junior engineer") {
        const access = [];
        const nameColumn = scope.role === "deputy engineer"
            ? "DEName"
            : "JEName";

        if (scope.district) {
            access.push("[District] = @assignedDistrict");
            request.input(
                "assignedDistrict",
                sql.NVarChar(255),
                scope.district
            );
        }

        if (scope.name) {
            request.input(
                "assignedName",
                sql.NVarChar(255),
                scope.name
            );
            access.push(
                `LTRIM(RTRIM([${nameColumn}])) = @assignedName`
            );
        }

        if (!access.length) {
            const error = new Error(
                "No District or name is assigned to this user."
            );
            error.statusCode = 403;
            throw error;
        }

        conditions.push(`(${access.join(" OR ")})`);
        return;
    }

    if (scope.role === "mla") {
        addNameCondition(["MLAName"]);
        return;
    }

    if (scope.role === "mp") {
        addNameCondition(["MPName"]);
        return;
    }

    if (scope.role === "contractor") {
        addNameCondition([
            "Contractor",
            "ElectricalContractor",
            "FurnitureContractor"
        ]);
        return;
    }

    const error = new Error("This role is not authorized to view reports.");
    error.statusCode = 403;
    throw error;
};


// Frontend filter keys mapped to SQL columns.
const filterColumns = {
    circle: 'Circle',
    budgetYear: 'YearOfApproval',
    workApprovalYear: 'YearOfApproval',
    district: 'District',
    workName: 'NameOfWork',
    executiveEngineer: 'EEName',
    deputyEngineer: 'DEName',
    juniorEngineer: 'JEName',
    mla: 'MLAName',
    mp: 'MPName',
    civilContractor: 'Contractor',
    electricalContractor: 'ElectricalContractor',
    architect: 'Architect',
    furnitureContractor: 'FurnitureContractor',
    workStatus: 'ActualStatus'
};

// GET: dropdown options for the selected scheme.

router.get('/options', async (req, res) => {
    try {
        const table = getSchemeTable(req.query.scheme);
        const pool = await getPool();
        const scope = await getReportScope(pool, req.user.userId);

        const optionColumns = {
            circles: { column: 'Circle', filters: ['circle'] },
            budgetYears: {
                column: 'YearOfApproval',
                filters: ['budgetYear', 'workApprovalYear']
            },
            workApprovalYears: {
                column: 'YearOfApproval',
                filters: ['budgetYear', 'workApprovalYear']
            },
            districts: { column: 'District', filters: ['district'] },
            workNames: { column: 'NameOfWork', filters: ['workName'] },
            executiveEngineers: {
                column: 'EEName', filters: ['executiveEngineer']
            },
            deputyEngineers: {
                column: 'DEName', filters: ['deputyEngineer']
            },
            juniorEngineers: {
                column: 'JEName', filters: ['juniorEngineer']
            },
            mlas: { column: 'MLAName', filters: ['mla'] },
            mps: { column: 'MPName', filters: ['mp'] },
            civilContractors: {
                column: 'Contractor', filters: ['civilContractor']
            },
            electricalContractors: {
                column: 'ElectricalContractor',
                filters: ['electricalContractor']
            },
            architects: { column: 'Architect', filters: ['architect'] },
            furnitureContractors: {
                column: 'FurnitureContractor',
                filters: ['furnitureContractor']
            },
            workStatuses: { column: 'ActualStatus', filters: ['workStatus'] }
        };

        const options = {};

        for (const [key, config] of Object.entries(optionColumns)) {
            const request = pool.request();
            const conditions = [];

            // Always enforce backend role-based access.
            applyReportScope(scope, request, conditions);

            // Apply the other selected filters, excluding this
            // dropdown's own filter.
            let index = 0;

            for (const [filterKey, column] of Object.entries(filterColumns)) {
                if (config.filters.includes(filterKey)) continue;

                const value = req.query[filterKey];

                if (typeof value === 'string' && value.trim() !== '') {
                    const parameter = `filter${index++}`;

                    conditions.push(`[${column}] = @${parameter}`);
                    request.input(
                        parameter,
                        sql.NVarChar(500),
                        value.trim()
                    );
                }
            }

            conditions.push(`
                [${config.column}] IS NOT NULL
                AND LTRIM(RTRIM(
                    CONVERT(NVARCHAR(500), [${config.column}])
                )) <> ''
            `);

            const result = await request.query(`
                SELECT DISTINCT [${config.column}] AS value
                FROM ${table}
                WHERE ${conditions.join(' AND ')}
                ORDER BY value;
            `);

            options[key] = result.recordset.map(row => row.value);
        }

        res.json(options);
    } catch (error) {
        console.error('Report options error:', error);

        res.status(error.statusCode || 500).json({
            message: error.message || 'Failed to load report filter options.'
        });
    }
});


router.get('/columns', async (req, res) => {
    try {
        const tableName = schemeTables[req.query.scheme];

        if (!tableName) {
            return res.status(400).json({
                message: 'Invalid or missing scheme.'
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('tableName', sql.NVarChar(128), tableName)
            .query(`
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = 'dbo'
                  AND TABLE_NAME = @tableName
                ORDER BY ORDINAL_POSITION;
            `);

        res.json(result.recordset.map(row => row.COLUMN_NAME));
    } catch (error) {
        console.error('Report columns error:', error);

        res.status(500).json({
            message: 'Failed to load report columns.'
        });
    }
});

// GET: filter and paginate records for the selected scheme.
router.get('/filter', async (req, res) => {
    try {
        const table = getSchemeTable(req.query.scheme);
        const pool = await getPool();
        const scope = await getReportScope(pool, req.user.userId);

        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const pageSize = Math.min(
            100,
            Math.max(1, parseInt(req.query.pageSize, 10) || 10)
        );

        const offset = (page - 1) * pageSize;
        const conditions = [];
        const request = pool.request();
        let index = 0;
        applyReportScope(scope, request, conditions);

        // Apply selected filters using parameterized values.
        for (const [key, column] of Object.entries(filterColumns)) {
            const rawValue = req.query[key];

            if (
                typeof rawValue === 'string' &&
                rawValue.trim() !== ''
            ) {
                const parameter = `value${index++}`;

                conditions.push(`[${column}] LIKE @${parameter}`);

                request.input(
                    parameter,
                    sql.NVarChar,
                    `%${rawValue.trim()}%`
                );
            }
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // Count matching records.
        const countResult = await request.query(`
            SELECT COUNT(*) AS total
            FROM ${table}
            ${whereClause};
        `);

        const total = countResult.recordset[0].total;

        // Fetch the requested page.
        const dataResult = await request
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize)
            .query(`
                SELECT *
                FROM ${table}
                ${whereClause}
                ORDER BY ProjectID DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY;
            `);

        res.json({
            data: dataResult.recordset,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error('Report pagination error:', error);

        res.status(error.statusCode || 500).json({
            message: error.statusCode
                ? error.message
                : 'Failed to retrieve report records.'
        });
    }
});

export default router;
