
import express from 'express';
import { getPool, sql } from '../config/db.js';

const router = express.Router();

const categoryOptions = {
    Amdar: ['VidhanSabha MLA', 'Vidhan Parishad MLA'],
    Khasdar: ['Lok Sabha MP', 'Rajya Sabha MP'],
};

// GET: Fetch active MLA/MP records
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT MLAMPID, MemberType, Category, MemberName,
                   IsActive, CreatedAt
            FROM MLAMPs
            WHERE IsActive = 1
            ORDER BY MemberName
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to fetch MLA/MP records.' });
    }
});

// Validate form fields
function validateMember(memberType, category, memberName) {
    return (
        Object.hasOwn(categoryOptions, memberType) &&
        categoryOptions[memberType].includes(category) &&
        typeof memberName === 'string' &&
        memberName.trim().length > 0 &&
        memberName.trim().length <= 150
    );
}

// POST: Add MLA/MP
router.post('/', async (req, res) => {
    try {
        const { type, category, name } = req.body;

        if (!validateMember(type, category, name)) {
            return res.status(400).json({
                message: 'Please provide a valid MLA/MP type, category, and name.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('MemberType', sql.NVarChar(20), type)
            .input('Category', sql.NVarChar(50), category)
            .input('MemberName', sql.NVarChar(150), name.trim())
            .query(`
                INSERT INTO MLAMPs (MemberType, Category, MemberName)
                OUTPUT
                    INSERTED.MLAMPID,
                    INSERTED.MemberType,
                    INSERTED.Category,
                    INSERTED.MemberName,
                    INSERTED.IsActive,
                    INSERTED.CreatedAt
                VALUES (@MemberType, @Category, @MemberName)
            `);

        res.status(201).json({
            message: 'MLA/MP added successfully.',
            member: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This MLA/MP record already exists.',
            });
        }

        console.error('Add MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to add MLA/MP.' });
    }
});

// PUT: Update MLA/MP
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { type, category, name } = req.body;

        if (
            !Number.isInteger(id) || id <= 0 ||
            !validateMember(type, category, name)
        ) {
            return res.status(400).json({
                message: 'Please provide a valid ID and MLA/MP details.',
            });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('MLAMPID', sql.Int, id)
            .input('MemberType', sql.NVarChar(20), type)
            .input('Category', sql.NVarChar(50), category)
            .input('MemberName', sql.NVarChar(150), name.trim())
            .query(`
                UPDATE MLAMPs
                SET MemberType = @MemberType,
                    Category = @Category,
                    MemberName = @MemberName
                WHERE MLAMPID = @MLAMPID;

                SELECT MLAMPID, MemberType, Category, MemberName,
                       IsActive, CreatedAt
                FROM MLAMPs
                WHERE MLAMPID = @MLAMPID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'MLA/MP record not found.' });
        }

        res.json({
            message: 'MLA/MP updated successfully.',
            member: result.recordset[0],
        });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(409).json({
                message: 'This MLA/MP record already exists.',
            });
        }

        console.error('Update MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to update MLA/MP.' });
    }
});

// DELETE: Delete MLA/MP
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid MLA/MP ID.' });
        }

        const pool = await getPool();

        const result = await pool.request()
            .input('MLAMPID', sql.Int, id)
            .query(`
                DELETE FROM MLAMPs
                WHERE MLAMPID = @MLAMPID;

                SELECT @@ROWCOUNT AS deletedCount;
            `);

        if (result.recordset[0].deletedCount === 0) {
            return res.status(404).json({ message: 'MLA/MP record not found.' });
        }

        res.json({ message: 'MLA/MP deleted successfully.' });
    } catch (error) {
        console.error('Delete MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to delete MLA/MP.' });
    }
});

export default router;
