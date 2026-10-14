

import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();


// Map frontend filter keys to real SQL columns.
// Never accept SQL column names directly from the request.
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

// GET: dropdown options from NHM table
router.get('/options', async (req, res) => {
    try {
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
        FROM dbo.NHM
        WHERE [${column}] IS NOT NULL
          AND LTRIM(RTRIM(CONVERT(NVARCHAR(500), [${column}]))) <> ''
        ORDER BY value;
      `);

            options[key] = result.recordset.map(row => row.value);
        }

        res.json(options);
    } catch (error) {
        console.error('Report options error:', error);
        res.status(500).json({
            message: 'Failed to load report filter options.'
        });
    }
});

// GET: filter project records
router.get('/filter', async (req, res) => {
    try {
        const pool = await getPool();
        const request = pool.request();
        const conditions = [];
        let index = 0;

        for (const [key, column] of Object.entries(filterColumns)) {
            const rawValue = req.query[key];

            if (
                typeof rawValue === 'string' &&
                rawValue.trim() !== ''
            ) {
                const parameter = `value${index++}`;

                conditions.push(
                    `[${column}] LIKE @${parameter}`
                );

                request.input(
                    parameter,
                    sql.NVarChar,
                    `%${rawValue.trim()}%`
                );
            }
        }

        const query = `
      SELECT *
      FROM dbo.NHM
      ${conditions.length
                ? `WHERE ${conditions.join(' AND ')}`
                : ''}
      ORDER BY ProjectID DESC;
    `;

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error('Report filtering error:', error);
        res.status(500).json({
            message: 'Failed to retrieve filtered reports.'
        });
    }
});

export default router;
