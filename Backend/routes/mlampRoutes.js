import express from 'express';
import { getPool, sql } from '../config/db.js';
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);


const categoryOptions = {
    Amdar: ['VidhanSabha MLA', 'Vidhan Parishad MLA'],
    Khasdar: ['Lok Sabha MP', 'Rajya Sabha MP'],
};

const clean = (value) =>
    typeof value === 'string' ? value.trim() : '';

function validateMember({ type, category, name, constituency, party, state }) {
    if (
        !Object.hasOwn(categoryOptions, type) ||
        !categoryOptions[type].includes(category)
    ) {
        return 'Please select a valid MLA/MP type and category.';
    }

    if (!clean(name) || clean(name).length > 200) {
        return 'Member name is required and must be 200 characters or fewer.';
    }

    if (clean(constituency).length > 150) {
        return 'Constituency must be 150 characters or fewer.';
    }

    if (clean(party).length > 200) {
        return 'Party must be 200 characters or fewer.';
    }

    if (!clean(state) || clean(state).length > 100) {
        return 'State is required and must be 100 characters or fewer.';
    }

    return null;
}

function bindMember(request, body) {
    return request
        .input('MemberType', sql.NVarChar(10), clean(body.type))
        .input('Category', sql.NVarChar(100), clean(body.category))
        .input('MemberName', sql.NVarChar(200), clean(body.name))
        .input('Constituency', sql.NVarChar(150), clean(body.constituency) || null)
        .input('Party', sql.NVarChar(200), clean(body.party) || null)
        .input('State', sql.NVarChar(100), clean(body.state));
}

// GET: Fetch active records
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT ID, MemberType, Category, MemberName,
                   Constituency, Party, State, IsActive, CreatedAt
            FROM dbo.MaharashtraMLA
            WHERE IsActive = 1
            ORDER BY MemberType, MemberName;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Fetch MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to fetch MLA/MP records.' });
    }
});

// POST: Add record
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const validationError = validateMember(body);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const pool = await getPool();
        const result = await bindMember(pool.request(), body).query(`
            INSERT INTO dbo.MaharashtraMLA
                (MemberType, Category, MemberName, Constituency,
                 Party, State, IsActive, CreatedAt)
            OUTPUT INSERTED.ID, INSERTED.MemberType, INSERTED.Category,
                   INSERTED.MemberName, INSERTED.Constituency,
                   INSERTED.Party, INSERTED.State,
                   INSERTED.IsActive, INSERTED.CreatedAt
            VALUES
                (@MemberType, @Category, @MemberName, @Constituency,
                 @Party, @State, 1, SYSDATETIME());
        `);

        res.status(201).json({
            message: 'MLA/MP added successfully.',
            member: result.recordset[0],
        });
    } catch (error) {
        console.error('Add MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to add MLA/MP.' });
    }
});

// PUT: Update record
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const body = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid MLA/MP ID.' });
        }

        const validationError = validateMember(body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const pool = await getPool();
        const request = bindMember(
            pool.request().input('ID', sql.Int, id),
            body
        );

        const result = await request.query(`
            UPDATE dbo.MaharashtraMLA
            SET MemberType = @MemberType,
                Category = @Category,
                MemberName = @MemberName,
                Constituency = @Constituency,
                Party = @Party,
                State = @State
            WHERE ID = @ID AND IsActive = 1;

            SELECT ID, MemberType, Category, MemberName,
                   Constituency, Party, State, IsActive, CreatedAt
            FROM dbo.MaharashtraMLA
            WHERE ID = @ID AND IsActive = 1;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Active MLA/MP record not found.',
            });
        }

        res.json({
            message: 'MLA/MP updated successfully.',
            member: result.recordset[0],
        });
    } catch (error) {
        console.error('Update MLA/MP error:', error.message);
        res.status(500).json({ message: 'Failed to update MLA/MP.' });
    }
});

// DELETE: Soft-delete record
// router.delete('/:id', async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         if (!Number.isInteger(id) || id <= 0) {
//             return res.status(400).json({ message: 'Invalid MLA/MP ID.' });
//         }

//         const pool = await getPool();
//         const result = await pool.request()
//             .input('ID', sql.Int, id)
//             .query(`
//                 UPDATE dbo.MaharashtraMLA
//                 SET IsActive = 0
//                 WHERE ID = @ID AND IsActive = 1;

//                 SELECT @@ROWCOUNT AS affectedCount;
//             `);

//         if (result.recordset[0].affectedCount === 0) {
//             return res.status(404).json({
//                 message: 'Active MLA/MP record not found.',
//             });
//         }

//         res.json({ message: 'MLA/MP deactivated successfully.' });
//     } catch (error) {
//         console.error('Deactivate MLA/MP error:', error.message);
//         res.status(500).json({ message: 'Failed to deactivate MLA/MP.' });
//     }
// });

export default router;
