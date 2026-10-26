import express from 'express';
import { getPool, sql } from '../config/db.js';
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireSE } from "../middleware/requireSE.js";

const router = express.Router();
router.use(authenticateToken);

// GET: Fetch all active schemes and sub-schemes
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT SchemeID, SchemeName, SubScheme, IsActive, CreatedAt
            FROM Schemes
            WHERE IsActive = 1
            ORDER BY SchemeName, SubScheme
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch schemes error:', error.message);
        res.status(500).json({ message: 'Failed to fetch schemes.' });
    }
});

// POST: Add a scheme and sub-scheme
router.post('/', requireSE, async (req, res) => {
    try {
        const schemeName = req.body.scheme?.trim();
        const subScheme = req.body.subScheme?.trim();

        if (!schemeName || !subScheme) {
            return res.status(400).json({
                message: 'Scheme and sub-scheme are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('SchemeName', sql.NVarChar(150), schemeName)
            .input('SubScheme', sql.NVarChar(150), subScheme)
            .query(`
                INSERT INTO Schemes (SchemeName, SubScheme)
                OUTPUT
                    INSERTED.SchemeID,
                    INSERTED.SchemeName,
                    INSERTED.SubScheme,
                    INSERTED.IsActive,
                    INSERTED.CreatedAt
                VALUES (@SchemeName, @SubScheme)
            `);

        res.status(201).json({
            message: 'Scheme added successfully.',
            scheme: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This scheme and sub-scheme combination already exists.',
            });
        }

        console.error('Add scheme error:', error.message);
        res.status(500).json({ message: 'Failed to add scheme.' });
    }
});

// PUT: Update a scheme and sub-scheme
router.put('/:id', requireSE, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const schemeName = req.body.scheme?.trim();
        const subScheme = req.body.subScheme?.trim();

        if (
            !Number.isInteger(id) || id <= 0 ||
            !schemeName || !subScheme
        ) {
            return res.status(400).json({
                message: 'Valid ID, scheme, and sub-scheme are required.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('SchemeID', sql.Int, id)
            .input('SchemeName', sql.NVarChar(150), schemeName)
            .input('SubScheme', sql.NVarChar(150), subScheme)
            .query(`
                UPDATE Schemes
                SET SchemeName = @SchemeName,
                    SubScheme = @SubScheme
                WHERE SchemeID = @SchemeID;

                SELECT SchemeID, SchemeName, SubScheme, IsActive, CreatedAt
                FROM Schemes
                WHERE SchemeID = @SchemeID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Scheme not found.' });
        }

        res.json({
            message: 'Scheme updated successfully.',
            scheme: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This scheme and sub-scheme combination already exists.',
            });
        }

        console.error('Update scheme error:', error.message);
        res.status(500).json({ message: 'Failed to update scheme.' });
    }
});

// // DELETE: Delete a scheme
// router.delete('/:id', async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         if (!Number.isInteger(id) || id <= 0) {
//             return res.status(400).json({ message: 'Invalid scheme ID.' });
//         }

//         const pool = await getPool();

//         const result = await pool.request()
//             .input('SchemeID', sql.Int, id)
//             .query(`
//                 DELETE FROM Schemes
//                 WHERE SchemeID = @SchemeID;

//                 SELECT @@ROWCOUNT AS deletedCount;
//             `);

//         if (result.recordset[0].deletedCount === 0) {
//             return res.status(404).json({ message: 'Scheme not found.' });
//         }

//         res.json({ message: 'Scheme deleted successfully.' });
//     } catch (error) {
//         console.error('Delete scheme error:', error.message);
//         res.status(500).json({ message: 'Failed to delete scheme.' });
//     }
// });

export default router;
