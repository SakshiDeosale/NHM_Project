
import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

// GET: Display all active circles
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT CircleID, CircleName, IsActive, CreatedAt
            FROM Circles
            WHERE IsActive = 1
            ORDER BY CircleName
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch circles error:', error.message);
        res.status(500).json({
            message: 'Failed to fetch circles.',
        });
    }
});

// POST: Add a new circle
router.post('/', async (req, res) => {
    try {
        const circleName = req.body.circleName?.trim();

        if (!circleName) {
            return res.status(400).json({
                message: 'Circle name is required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input(
                'CircleName',
                sql.NVarChar(100),
                circleName
            )
            .query(`
                INSERT INTO Circles (CircleName)
                OUTPUT
                    INSERTED.CircleID,
                    INSERTED.CircleName,
                    INSERTED.IsActive,
                    INSERTED.CreatedAt
                VALUES (@CircleName)
            `);

        res.status(201).json({
            message: 'Circle added successfully.',
            circle: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This circle already exists.',
            });
        }

        console.error('Add circle error:', error.message);
        res.status(500).json({
            message: 'Failed to add circle.',
        });
    }
});


/* PUT: Update an existing circle */
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const circleName = req.body.circleName?.trim();

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid circle ID.' });
        }

        if (!circleName) {
            return res.status(400).json({ message: 'Circle name is required.' });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('CircleID', sql.Int, id)
            .input('CircleName', sql.NVarChar(100), circleName)
            .query(`
                UPDATE Circles
                SET CircleName = @CircleName
                WHERE CircleID = @CircleID;

                SELECT CircleID, CircleName, IsActive, CreatedAt
                FROM Circles
                WHERE CircleID = @CircleID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Circle not found.' });
        }

        res.json({
            message: 'Circle updated successfully.',
            circle: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({ message: 'This circle already exists.' });
        }

        console.error('Update circle error:', error.message);
        res.status(500).json({ message: 'Failed to update circle.' });
    }
});

/* DELETE: Delete a circle */
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid circle ID.' });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('CircleID', sql.Int, id)
            .query(`
                DELETE FROM Circles
                WHERE CircleID = @CircleID;

                SELECT @@ROWCOUNT AS deletedCount;
            `);

        if (result.recordset[0].deletedCount === 0) {
            return res.status(404).json({ message: 'Circle not found.' });
        }

        res.json({ message: 'Circle deleted successfully.' });
    } catch (error) {
        if (error.number === 547) {
            return res.status(409).json({
                message: 'This circle cannot be deleted because districts are linked to it.',
            });
        }

        console.error('Delete circle error:', error.message);
        res.status(500).json({ message: 'Failed to delete circle.' });
    }
});


export default router;
