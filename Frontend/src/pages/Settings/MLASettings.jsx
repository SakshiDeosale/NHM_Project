
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/mlamps';

const categoryOptions = {
    Amdar: ['VidhanSabha MLA', 'Vidhan Parishad MLA'],
    Khasdar: ['Lok Sabha MP', 'Rajya Sabha MP'],
};

export default function MLASettings() {
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [members, setMembers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch records from SQL Server
    const fetchMembers = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch MLA/MP records.');
            }

            setMembers(await response.json());
        } catch (err) {
            setError(err.message || 'Unable to load records. Check the backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setCategory('');
    };

    // Add or update a record
    const handleSave = async () => {
        if (!type || !category || !name.trim()) {
            setError('Please select the type and category and enter a name.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const isEditing = editingId !== null;

            const response = await fetch(
                isEditing ? `${API_URL}/${editingId}` : API_URL,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type,
                        category,
                        name: name.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save record.');
            }

            setMessage(data.message || 'Record saved successfully.');
            resetForm();
            await fetchMembers();
        } catch (err) {
            setError(err.message || 'Unable to save record.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setType(item.MemberType);
        setCategory(item.Category);
        setName(item.MemberName);
        setEditingId(item.MLAMPID);
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setType('');
        setCategory('');
        setName('');
        setEditingId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError('');
        setMessage('');
    };

    // Delete a record
    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.MemberName}"?`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            const response = await fetch(`${API_URL}/${item.MLAMPID}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete record.');
            }

            setMessage(data.message || 'Record deleted successfully.');

            if (editingId === item.MLAMPID) {
                resetForm();
            }

            await fetchMembers();
        } catch (err) {
            setError(err.message || 'Unable to delete record.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-person-vcard" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Add MLA / MP</h1>
                        <p className="text-muted mb-0">
                            Add MLA or MP information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
                        {editingId !== null ? 'Edit MLA / MP' : 'Add MLA / MP'}
                    </h2>

                    <p className="text-muted mb-0">
                        Enter the MLA or MP details.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label htmlFor="type" className="report-filter-label">
                            MLA/MP
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="type"
                                className="form-select"
                                value={type}
                                onChange={handleTypeChange}
                            >
                                <option value="">Select MLA/MP</option>
                                <option value="Amdar">Amdar</option>
                                <option value="Khasdar">Khasdar</option>
                            </select>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="category" className="report-filter-label">
                            Type
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="category"
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={!type}
                            >
                                <option value="">Select Type</option>
                                {type &&
                                    categoryOptions[type].map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="name" className="report-filter-label">
                            MLA/MP Name
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="name"
                                type="text"
                                className="form-control"
                                placeholder="Enter MLA/MP Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <div></div>
                        <div className="report-filter-control">
                            <button
                                type="button"
                                className="btn btn-primary me-2"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                <i className="bi bi-plus-circle me-1"></i>
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update'
                                        : 'Add'}
                            </button>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {message && (
                    <p className="text-success mt-3 mb-0" role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="text-danger mt-3 mb-0" role="alert">
                        {error}
                    </p>
                )}
            </section>

            <section className="panel mt-4">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-list-ul me-2"></i>
                        MLA / MP List
                    </h2>
                    <p className="text-muted mb-0">
                        Records saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted">Loading records...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>MLA/MP</th>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No records found.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((item) => (
                                        <tr key={item.MLAMPID}>
                                            <td>{item.MLAMPID}</td>
                                            <td>{item.MemberType}</td>
                                            <td>{item.Category}</td>
                                            <td>{item.MemberName}</td>
                                            <td>
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <i className="bi bi-pencil-square me-1"></i>
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <i className="bi bi-trash me-1"></i>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}
