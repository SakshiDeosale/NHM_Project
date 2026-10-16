
import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

const validate = (body) => {
    const sourceSheet = String(body.sourceSheet ?? '').trim();
    const contractorName = String(body.contractorName ?? '').trim();
    const position = String(body.position ?? '').trim();
    const srNo = body.srNo === '' || body.srNo == null
        ? null
        : Number(body.srNo);

    if (!sourceSheet || sourceSheet.length > 20) {
        return 'Source Sheet is required (maximum 20 characters).';
    }
    if (!contractorName || contractorName.length > 300) {
        return 'Contractor Name is required (maximum 300 characters).';
    }
    if (!position || position.length > 50) {
        return 'Position is required (maximum 50 characters).';
    }
    if (srNo !== null && (!Number.isInteger(srNo) || srNo < 0)) {
        return 'Sr. No. must be a non-negative whole number.';
    }

    const vendorClass = String(body.vendorClass ?? '').trim();
    const region = String(body.region ?? '').trim();
    const entryDate = String(body.entryDate ?? '').trim();

    if (vendorClass.length > 50) return 'Vendor Class must be at most 50 characters.';
    if (region.length > 100) return 'Region must be at most 100 characters.';
    if (entryDate.length > 50) return 'Entry Date must be at most 50 characters.';

    return {
        sourceSheet, srNo, contractorName,
        vendorClass: vendorClass || null,
        region: region || null,
        entryDate: entryDate || null,
        position,
    };
};

const bind = (request, value) => request
    .input('SourceSheet', sql.NVarChar(20), value.sourceSheet)
    .input('SrNo', sql.Int, value.srNo)
    .input('ContractorName', sql.NVarChar(300), value.contractorName)
    .input('VendorClass', sql.NVarChar(50), value.vendorClass)
    .input('Region', sql.NVarChar(100), value.region)
    .input('EntryDate', sql.NVarChar(50), value.entryDate)
    .input('Position', sql.NVarChar(50), value.position);

const columns = `
    ID, SourceSheet, SrNo, ContractorName,
    VendorClass, Region, EntryDate, Position
`;

// GET: List all contractors
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT ${columns}
            FROM dbo.ContractorInfo
            ORDER BY SourceSheet, SrNo, ContractorName;
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch contractors error:', error.message);
        res.status(500).json({ message: 'Failed to fetch contractors.' });
    }
});

// POST: Add contractor
router.post('/', async (req, res) => {
    const value = validate(req.body);
    if (typeof value === 'string') {
        return res.status(400).json({ message: value });
    }

    try {
        const pool = await getPool();
        const result = await bind(pool.request(), value).query(`
            INSERT INTO dbo.ContractorInfo
                (SourceSheet, SrNo, ContractorName, VendorClass,
                 Region, EntryDate, Position)
            OUTPUT INSERTED.ID, INSERTED.SourceSheet, INSERTED.SrNo,
                   INSERTED.ContractorName, INSERTED.VendorClass,
                   INSERTED.Region, INSERTED.EntryDate, INSERTED.Position
            VALUES
                (@SourceSheet, @SrNo, @ContractorName, @VendorClass,
                 @Region, @EntryDate, @Position);
        `);

        res.status(201).json({
            message: 'Contractor added successfully.',
            contractor: result.recordset[0],
        });
    } catch (error) {
        console.error('Add contractor error:', error.message);
        res.status(500).json({ message: 'Failed to add contractor.' });
    }
});

// PUT: Update contractor
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const value = validate(req.body);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid contractor ID.' });
    }
    if (typeof value === 'string') {
        return res.status(400).json({ message: value });
    }

    try {
        const pool = await getPool();
        const result = await bind(
            pool.request().input('ID', sql.Int, id),
            value
        ).query(`
            UPDATE dbo.ContractorInfo
            SET SourceSheet = @SourceSheet,
                SrNo = @SrNo,
                ContractorName = @ContractorName,
                VendorClass = @VendorClass,
                Region = @Region,
                EntryDate = @EntryDate,
                Position = @Position
            WHERE ID = @ID;

            SELECT ${columns}
            FROM dbo.ContractorInfo
            WHERE ID = @ID;
        `);

        if (!result.recordset.length) {
            return res.status(404).json({ message: 'Contractor not found.' });
        }

        res.json({
            message: 'Contractor updated successfully.',
            contractor: result.recordset[0],
        });
    } catch (error) {
        console.error('Update contractor error:', error.message);
        res.status(500).json({ message: 'Failed to update contractor.' });
    }
});

// DELETE: Delete contractor
// router.delete('/:id', async (req, res) => {
//     const id = Number(req.params.id);

//     if (!Number.isInteger(id) || id <= 0) {
//         return res.status(400).json({ message: 'Invalid contractor ID.' });
//     }

//     try {
//         const pool = await getPool();
//         const result = await pool.request()
//             .input('ID', sql.Int, id)
//             .query(`
//                 DELETE FROM dbo.ContractorInfo
//                 WHERE ID = @ID;

//                 SELECT @@ROWCOUNT AS deletedCount;
//             `);

//         if (result.recordset[0]?.deletedCount === 0) {
//             return res.status(404).json({ message: 'Contractor not found.' });
//         }

//         res.json({ message: 'Contractor deleted successfully.' });
//     } catch (error) {
//         console.error('Delete contractor error:', error.message);
//         res.status(500).json({ message: 'Failed to delete contractor.' });
//     }
// });

export default router;
