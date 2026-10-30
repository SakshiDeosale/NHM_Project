
import React, { useState, useEffect } from 'react';
import API_URL, { apiFetch } from "../../utils/api";

const SCHEMES_API = `${API_URL}/schemes`;

export default function SchemeSettings() {
    const [scheme, setScheme] = useState('');
    const [schemeDescription, setSchemeDescription] = useState('');
    const [schemes, setSchemes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch schemes from SQL Server
    const fetchSchemes = async () => {
        try {
            const response = await apiFetch(SCHEMES_API);

            if (!response.ok) {
                throw new Error('Failed to fetch schemes.');
            }

            setSchemes(await response.json());
        } catch (err) {
            setError(err.message || 'Unable to load schemes. Check the backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, []);

    // Add or update a scheme
    const handleSave = async () => {
        const schemeName = scheme.trim();
        const subScheme = schemeDescription.trim();

        if (!schemeName || !subScheme) {
            setError('Please enter both Scheme and Sub Scheme.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const isEditing = editingId !== null;

            const response = await apiFetch(
                isEditing ? `${SCHEMES_API}/${editingId}` : SCHEMES_API,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        scheme: schemeName,
                        subScheme,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save scheme.');
            }

            setMessage(data.message || 'Scheme saved successfully.');
            resetForm();
            await fetchSchemes();
        } catch (err) {
            setError(err.message || 'Unable to save scheme.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setScheme(item.SchemeName);
        setSchemeDescription(item.SubScheme);
        setEditingId(item.SchemeID);
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setScheme('');
        setSchemeDescription('');
        setEditingId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError('');
        setMessage('');
    };

    // Delete a scheme
    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.SchemeName} - ${item.SubScheme}"?`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            const response = await apiFetch(`${SCHEMES_API}/${item.SchemeID}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete scheme.');
            }

            setMessage(data.message || 'Scheme deleted successfully.');

            if (editingId === item.SchemeID) {
                resetForm();
            }

            await fetchSchemes();
        } catch (err) {
            setError(err.message || 'Unable to delete scheme.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-folder2-open" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Scheme</h1>
                        <p className="text-muted mb-0">
                            Add and manage Scheme information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
                        {editingId !== null ? 'Edit Scheme' : 'Add Scheme'}
                    </h2>

                    <p className="text-muted mb-0">
                        Enter the Scheme information.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label htmlFor="scheme" className="report-filter-label">
                            Scheme
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="scheme"
                                type="text"
                                className="form-control"
                                placeholder="Enter Scheme"
                                value={scheme}
                                onChange={(e) => setScheme(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label
                            htmlFor="schemeDescription"
                            className="report-filter-label"
                        >
                            Sub Scheme
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="schemeDescription"
                                type="text"
                                className="form-control"
                                placeholder="Enter Sub Scheme"
                                value={schemeDescription}
                                onChange={(e) => setSchemeDescription(e.target.value)}
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
                        Scheme List
                    </h2>

                    <p className="text-muted mb-0">
                        Schemes saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted">Loading schemes...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Scheme</th>
                                    <th>Sub Scheme</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {schemes.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No schemes found.
                                        </td>
                                    </tr>
                                ) : (
                                    schemes.map((item) => (
                                        <tr key={item.SchemeID}>
                                            <td>{item.SchemeID}</td>
                                            <td>{item.SchemeName}</td>
                                            <td>{item.SubScheme}</td>
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
