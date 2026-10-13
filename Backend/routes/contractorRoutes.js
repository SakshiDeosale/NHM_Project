
import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// GET: Fetch active contractors
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT ContractorID, ContractorName, ContractorNumber,
                   Position, IsActive, CreatedAt
            FROM Contractors
            WHERE IsActive = 1
            ORDER BY ContractorName
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch contractors error:', error.message);
        res.status(500).json({ message: 'Failed to fetch contractors.' });
    }
});

// POST: Add contractor
router.post('/', async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const contractorNumber = req.body.contractorNumber?.trim();
        const position = req.body.position?.trim();

        if (!name || !contractorNumber || !position) {
            return res.status(400).json({
                message: 'Contractor name, number, and position are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('ContractorName', sql.NVarChar(150), name)
            .input('ContractorNumber', sql.NVarChar(50), contractorNumber)
            .input('Position', sql.NVarChar(100), position)
            .query(`
                INSERT INTO Contractors
                    (ContractorName, ContractorNumber, Position)
                OUTPUT
                    INSERTED.ContractorID,
                    INSERTED.ContractorName,
                    INSERTED.ContractorNumber,
                    INSERTED.Position,
                    INSERTED.IsActive,
                    INSERTED.CreatedAt
                VALUES (@ContractorName, @ContractorNumber, @Position)
            `);

        res.status(201).json({
            message: 'Contractor added successfully.',
            contractor: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This contractor number already exists.',
            });
        }

        console.error('Add contractor error:', error.message);
        res.status(500).json({ message: 'Failed to add contractor.' });
    }
});

// PUT: Update contractor
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const name = req.body.name?.trim();
        const contractorNumber = req.body.contractorNumber?.trim();
        const position = req.body.position?.trim();

        if (
            !Number.isInteger(id) || id <= 0 ||
            !name || !contractorNumber || !position
        ) {
            return res.status(400).json({
                message: 'Valid contractor details are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('ContractorID', sql.Int, id)
            .input('ContractorName', sql.NVarChar(150), name)
            .input('ContractorNumber', sql.NVarChar(50), contractorNumber)
            .input('Position', sql.NVarChar(100), position)
            .query(`
                UPDATE Contractors
                SET ContractorName = @ContractorName,
                    ContractorNumber = @ContractorNumber,
                    Position = @Position
                WHERE ContractorID = @ContractorID;

                SELECT ContractorID, ContractorName, ContractorNumber,
                       Position, IsActive, CreatedAt
                FROM Contractors
                WHERE ContractorID = @ContractorID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Contractor not found.' });
        }

        res.json({
            message: 'Contractor updated successfully.',
            contractor: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This contractor number already exists.',
            });
        }

        console.error('Update contractor error:', error.message);
        res.status(500).json({ message: 'Failed to update contractor.' });
    }
});

// DELETE: Delete contractor
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid contractor ID.' });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('ContractorID', sql.Int, id)
            .query(`
                DELETE FROM Contractors
                WHERE ContractorID = @ContractorID;

                SELECT @@ROWCOUNT AS deletedCount;
            `);

        if (result.recordset[0].deletedCount === 0) {
            return res.status(404).json({ message: 'Contractor not found.' });
        }

        res.json({ message: 'Contractor deleted successfully.' });
    } catch (error) {
        console.error('Delete contractor error:', error.message);
        res.status(500).json({ message: 'Failed to delete contractor.' });
    }
});

export default router;
