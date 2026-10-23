
import React, { useState, useEffect } from 'react';
import { apiFetch } from "../../utils/api";

const API_URL = 'http://localhost:5000/api/circles';

export default function CircleSettings() {
    const [circle, setCircle] = useState('');
    const [circles, setCircles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchCircles = async () => {
        try {
            const response = await apiFetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch circles.');

            setCircles(await response.json());
        } catch (err) {
            setError('Unable to load circles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCircles();
    }, []);

    const handleAdd = async () => {
        const circleName = circle.trim();

        if (!circleName) {
            setError('Please enter a circle name.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const isEditing = editingId !== null;
            const response = await apiFetch(
                isEditing ? `${API_URL}/${editingId}` : API_URL,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ circleName }),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Operation failed.');

            setMessage(data.message);
            setCircle('');
            setEditingId(null);
            await fetchCircles();
        } catch (err) {
            setError(err.message || 'Unable to save circle.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setCircle(item.CircleName);
        setEditingId(item.CircleID);
        setError('');
        setMessage('');
    };

    const handleCancel = () => {
        setCircle('');
        setEditingId(null);
        setError('');
        setMessage('');
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.CircleName}"?`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            const response = await apiFetch(`${API_URL}/${item.CircleID}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Delete failed.');

            setMessage(data.message);

            if (editingId === item.CircleID) {
                handleCancel();
            }

            await fetchCircles();
        } catch (err) {
            setError(err.message || 'Unable to delete circle.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-diagram-3" aria-hidden="true"></i>
                    </span>
                    <div>
                        <h1 className="h3 mb-1">Circle</h1>
                        <p className="text-muted mb-0">
                            Add and manage Circle information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
                        {editingId !== null ? 'Edit Circle' : 'Add Circle'}
                    </h2>
                    <p className="text-muted mb-0">
                        Enter the Circle name and save your changes.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label htmlFor="circle" className="report-filter-label">
                            Circle
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="circle"
                                type="text"
                                className="form-control"
                                placeholder="Enter Circle"
                                value={circle}
                                onChange={(e) => setCircle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAdd();
                                }}
                            />
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary report-filter-ok"
                            onClick={handleAdd}
                            disabled={saving}
                        >
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
                        <i className="bi bi-list-ul me-2" aria-hidden="true"></i>
                        Circle List
                    </h2>
                    <p className="text-muted mb-0">
                        Circles saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted">Loading circles...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Circle Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {circles.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No circles found.
                                        </td>
                                    </tr>
                                ) : (
                                    circles.map((item) => (
                                        <tr key={item.CircleID}>
                                            <td>{item.CircleID}</td>
                                            <td>{item.CircleName}</td>
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
                                                    title="Edit circle"
                                                >
                                                    <i className="bi bi-pencil-square me-1"></i>
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(item)}
                                                    title="Delete circle"
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
