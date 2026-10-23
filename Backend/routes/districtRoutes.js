import express from 'express';
import { getPool, sql } from '../config/db.js';
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);


// GET: Fetch districts with their circle names
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT
                d.DistrictID,
                d.DistrictName,
                d.CircleID,
                c.CircleName,
                d.IsActive,
                d.CreatedAt
            FROM Districts d
            INNER JOIN Circles c ON d.CircleID = c.CircleID
            WHERE d.IsActive = 1
            ORDER BY d.DistrictName
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch districts error:', error.message);
        res.status(500).json({ message: 'Failed to fetch districts.' });
    }
});

// POST: Add a district
router.post('/', async (req, res) => {
    try {
        const districtName = req.body.districtName?.trim();
        const circleID = Number(req.body.circleID);

        if (!districtName || !Number.isInteger(circleID) || circleID <= 0) {
            return res.status(400).json({
                message: 'Valid district name and circle are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('DistrictName', sql.NVarChar(100), districtName)
            .input('CircleID', sql.Int, circleID)
            .query(`
                INSERT INTO Districts (DistrictName, CircleID)
                OUTPUT
                    INSERTED.DistrictID,
                    INSERTED.DistrictName,
                    INSERTED.CircleID,
                    INSERTED.IsActive,
                    INSERTED.CreatedAt
                VALUES (@DistrictName, @CircleID)
            `);

        res.status(201).json({
            message: 'District added successfully.',
            district: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This district already exists in the selected circle.',
            });
        }

        if (error.number === 547) {
            return res.status(400).json({
                message: 'Selected circle does not exist.',
            });
        }

        console.error('Add district error:', error.message);
        res.status(500).json({ message: 'Failed to add district.' });
    }
});

// PUT: Edit a district
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const districtName = req.body.districtName?.trim();
        const circleID = Number(req.body.circleID);

        if (
            !Number.isInteger(id) || id <= 0 ||
            !districtName ||
            !Number.isInteger(circleID) || circleID <= 0
        ) {
            return res.status(400).json({
                message: 'Valid district ID, name, and circle are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('DistrictID', sql.Int, id)
            .input('DistrictName', sql.NVarChar(100), districtName)
            .input('CircleID', sql.Int, circleID)
            .query(`
                UPDATE Districts
                SET DistrictName = @DistrictName,
                    CircleID = @CircleID
                WHERE DistrictID = @DistrictID;

                SELECT
                    d.DistrictID,
                    d.DistrictName,
                    d.CircleID,
                    c.CircleName,
                    d.IsActive,
                    d.CreatedAt
                FROM Districts d
                INNER JOIN Circles c ON d.CircleID = c.CircleID
                WHERE d.DistrictID = @DistrictID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'District not found.' });
        }

        res.json({
            message: 'District updated successfully.',
            district: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This district already exists in the selected circle.',
            });
        }

        console.error('Update district error:', error.message);
        res.status(500).json({ message: 'Failed to update district.' });
    }
});

// DELETE: Delete a district
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid district ID.' });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('DistrictID', sql.Int, id)
            .query(`
                DELETE FROM Districts
                WHERE DistrictID = @DistrictID;

                SELECT @@ROWCOUNT AS deletedCount;
            `);

        if (result.recordset[0].deletedCount === 0) {
            return res.status(404).json({ message: 'District not found.' });
        }

        res.json({ message: 'District deleted successfully.' });
    } catch (error) {
        console.error('Delete district error:', error.message);
        res.status(500).json({ message: 'Failed to delete district.' });
    }
});

export default router;
