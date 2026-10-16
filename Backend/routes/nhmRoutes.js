import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// React form state keys mapped to the real dbo.NHM column names.
const fieldToColumn = {
    srNo: 'SrNo',
    workId: 'workId',
    district: 'District',
    fmrCode: 'FMRCode',
    nameOfWork: 'NameOfWork',
    yearOfApproval: 'YearOfApproval',
    projectCost: 'ProjectCost',
    aaDate: 'AADate',
    aaAmount: 'AAAmount',
    eeName: 'EEName',
    eeContact: 'EEContact',
    deName: 'DEName',
    deContact: 'DEContact',
    jeName: 'JEName',
    jeContact: 'JEContact',
    mlaName: 'MLAName',
    mlaConstituency: 'MLAConstituency',
    mpName: 'MPName',
    mpConstituency: 'MPConstituency',
    circle: 'Circle',
    civilTsDate: 'CivilTSDate',
    civilTsAmount: 'CivilTSAmount',
    civilWoDate: 'CivilWODate',
    civilWoAmount: 'CivilWOAmount',
    architect: 'Architect',
    architectWoDate: 'ArchitectWODate',
    architectContact: 'ArchitectContact',
    feesPercent: 'FeesPercent',
    feesPaid: 'FeesPaid',
    contractorName: 'Contractor',
    contractorContact: 'ContractorContact',
    civilTenderPercent: 'CivilTenderPercent',
    civilTenderType: 'CivilTenderType',
    civilExpenditure: 'CivilExpenditure',
    electricalContractor: 'ElectricalContractor',
    electricalContact: 'ElectricalContact',
    electricalTsDate: 'ElectricalTSDate',
    electricalTsAmount: 'ElectricalTSAmount',
    electricalWoDate: 'ElectricalWODate',
    electricalWoAmount: 'ElectricalWOAmount',
    electricalTenderPercent: 'ElectricalTenderPercent',
    electricalTenderType: 'ElectricalTenderType',
    electricalExpenditure: 'ElectricalExpenditure',
    electricalStatus: 'ElectricalStatus',
    mgpsContractor: 'MGPSContractor',
    mgpsContact: 'MGPSContact',
    mgpsTsDate: 'MGPSTSDate',
    mgpsTsAmount: 'MGPSTSAmount',
    mgpsWoDate: 'MGPSWODate',
    mgpsWoAmount: 'MGPSWOAmount',
    mgpsTenderPercent: 'MGPSTenderPercent',
    mgpsTenderType: 'MGPSTenderType',
    mgpsExpenditure: 'MGPSExpenditure',
    mgpsStatus: 'MGPSStatus',
    furnitureContractor: 'FurnitureContractor',
    furnitureContact: 'FurnitureContact',
    furnitureTsDate: 'FurnitureTSDate',
    furnitureTsAmount: 'FurnitureTSAmount',
    furnitureWoDate: 'FurnitureWODate',
    furnitureWoAmount: 'FurnitureWOAmount',
    furnitureTenderPercent: 'FurnitureTenderPercent',
    furnitureTenderType: 'FurnitureTenderType',
    furnitureExpenditure: 'FurnitureExpenditure',
    furnitureStatus: 'FurnitureStatus',
    waterSupplyStatus: 'WaterSupplyStatus',
    transformerStatus: 'TransformerStatus',
    fireFightingStatus: 'FireFightingStatus',
    stpEtpStatus: 'STPETPStatus',
    liftStatus: 'LiftStatus',
    hvacStatus: 'HVACStatus',
    otherExpenditure: 'OtherExpenditure',
    actualStatus: 'ActualStatus',
    remarks: 'Remarks',
};

// GET: next display serial number (SrNo is separate from identity ProjectID).
router.get('/next-sr-no', async (_req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT ISNULL(MAX(TRY_CONVERT(INT, SrNo)), 0) + 1 AS srNo
            FROM dbo.NHM;
        `);
        res.json({ srNo: result.recordset[0]?.srNo ?? 1 });
    } catch (error) {
        console.error('Failed to fetch next NHM serial number:', error.message);
        res.status(500).json({ message: 'Failed to fetch serial number.' });
    }
});

// POST: save an NHM project.
router.post('/', async (req, res) => {
    try {
        const form = req.body;
        if (!form || typeof form !== 'object' || Array.isArray(form)) {
            return res.status(400).json({ message: 'Invalid form data.' });
        }

        const workId = String(form.workId ?? '').trim();
        if (!workId || !/^\d+$/.test(workId) || /^0+$/.test(workId)) {
            return res.status(400).json({
                message: 'Work ID is required and must contain digits greater than zero.',
            });
        }

        const pool = await getPool();
        const duplicate = await pool.request()
            .input('WorkID', sql.NVarChar(50), workId)
            .query('SELECT TOP 1 ProjectID FROM dbo.NHM WHERE workId = @WorkID;');

        if (duplicate.recordset.length) {
            return res.status(409).json({
                message: 'This Work ID already exists. Please enter a unique Work ID.',
            });
        }

        // Read the actual insertable columns, excluding identity ProjectID.
        const schemaResult = await pool.request().query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = 'dbo'
              AND TABLE_NAME = 'NHM'
              AND COLUMNPROPERTY(OBJECT_ID('dbo.NHM'), COLUMN_NAME, 'IsIdentity') = 0;
        `);
        const actualColumns = schemaResult.recordset.map((row) => row.COLUMN_NAME);
        if (!actualColumns.length) {
            return res.status(500).json({ message: 'dbo.NHM was not found or has no insertable columns.' });
        }

        const entries = Object.entries(fieldToColumn)
            .filter(([key, column]) => Object.hasOwn(form, key) && actualColumns.some((actual) => actual.toLowerCase() === column.toLowerCase()))
            .map(([key, column]) => ({ key, column: actualColumns.find((actual) => actual.toLowerCase() === column.toLowerCase()), value: form[key] }));

        if (!entries.some((entry) => entry.column.toLowerCase() === 'workid')) {
            return res.status(400).json({ message: 'Work ID does not map to dbo.NHM.workId.' });
        }

        const request = pool.request();
        const columnNames = [];
        const parameterNames = [];
        entries.forEach((entry, index) => {
            const parameter = `value${index}`;
            const value = entry.value === '' || entry.value === undefined || entry.value === null
                ? null
                : String(entry.value).trim();
            request.input(parameter, sql.NVarChar(sql.MAX), value);
            columnNames.push(`[${entry.column.replace(/]/g, ']]')}]`);
            parameterNames.push(`@${parameter}`);
        });

        const result = await request.query(`
            INSERT INTO dbo.NHM (${columnNames.join(', ')})
            OUTPUT INSERTED.ProjectID
            VALUES (${parameterNames.join(', ')});
        `);

        return res.status(201).json({
            success: true,
            message: 'NHM project saved successfully.',
            projectId: result.recordset[0]?.ProjectID ?? null,
        });
    } catch (error) {
        console.error('NHM save failed:', error.message);
        if (error.number === 2601 || error.number === 2627) {
            return res.status(409).json({ message: 'This Work ID already exists.' });
        }
        return res.status(500).json({ message: 'Unable to save NHM project. Check backend logs.' });
    }
});

export default router;
