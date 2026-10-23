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

        const optionColumns = {
            circles: 'Circle',
            budgetYears: 'YearOfApproval',
            workApprovalYears: 'YearOfApproval',
            districts: 'District',
            workNames: 'NameOfWork',
            executiveEngineers: 'EEName',
            deputyEngineers: 'DEName',
            juniorEngineers: 'JEName',
            mlas: 'MLAName',
            mps: 'MPName',
            civilContractors: 'Contractor',
            electricalContractors: 'ElectricalContractor',
            architects: 'Architect',
            furnitureContractors: 'FurnitureContractor',
            workStatuses: 'ActualStatus'
        };

        const options = {};

        for (const [key, column] of Object.entries(optionColumns)) {
            const result = await pool.request().query(`
                SELECT DISTINCT [${column}] AS value
                FROM ${table}
                WHERE [${column}] IS NOT NULL
                  AND LTRIM(RTRIM(
                      CONVERT(NVARCHAR(500), [${column}])
                  )) <> ''
                ORDER BY value;
            `);

            options[key] = result.recordset.map(row => row.value);
        }

        res.json(options);
    } catch (error) {
        console.error('Report options error:', error);

        res.status(error.statusCode || 500).json({
            message: error.statusCode
                ? error.message
                : 'Failed to load report filter options.'
        });
    }
});

// GET: filter and paginate records for the selected scheme.
router.get('/filter', async (req, res) => {
    try {
        const table = getSchemeTable(req.query.scheme);
        const pool = await getPool();

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
