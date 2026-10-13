
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/contractors';

const positions = [
    'Civil Contractor',
    'Electrical Contractor',
    'Furniture Contractor',
    'Architect',
];

export default function ContractorSettings() {
    const [name, setName] = useState('');
    const [contractorNumber, setContractorNumber] = useState('');
    const [position, setPosition] = useState('');
    const [contractors, setContractors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch contractors from SQL Server
    const fetchContractors = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch contractors.');
            }

            setContractors(await response.json());
        } catch (err) {
            setError(err.message || 'Unable to load contractors. Check the backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractors();
    }, []);

    // Add or update contractor
    const handleSave = async () => {
        if (!name.trim() || !contractorNumber.trim() || !position) {
            setError('Please enter the contractor name, number, and position.');
            return;
        }


        if (!/^[0-9]{10}$/.test(contractorNumber.trim())) {
            setError('Contractor Number must contain exactly 10 digits.');
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
                        name: name.trim(),
                        contractorNumber: contractorNumber.trim(),
                        position,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save contractor.');
            }

            setMessage(data.message || 'Contractor saved successfully.');
            resetForm();
            await fetchContractors();
        } catch (err) {
            setError(err.message || 'Unable to save contractor.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setName(item.ContractorName);
        setContractorNumber(item.ContractorNumber);
        setPosition(item.Position);
        setEditingId(item.ContractorID);
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setName('');
        setContractorNumber('');
        setPosition('');
        setEditingId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError('');
        setMessage('');
    };

    // Delete contractor
    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.ContractorName}"?`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            const response = await fetch(
                `${API_URL}/${item.ContractorID}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete contractor.');
            }

            setMessage(data.message || 'Contractor deleted successfully.');

            if (editingId === item.ContractorID) {
                resetForm();
            }

            await fetchContractors();
        } catch (err) {
            setError(err.message || 'Unable to delete contractor.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-person-workspace" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Contractor</h1>
                        <p className="text-muted mb-0">
                            Add and manage contractor information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
                        {editingId !== null ? 'Edit Contractor' : 'Add Contractor'}
                    </h2>

                    <p className="text-muted mb-0">
                        Enter contractor details below.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label htmlFor="name" className="report-filter-label">
                            Contractor Name
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="name"
                                type="text"
                                className="form-control"
                                placeholder="Enter Contractor Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label
                            htmlFor="contractorNumber"
                            className="report-filter-label"
                        >
                            Contractor Number
                        </label>

                        <div className="report-filter-control">

                            <input
                                id="contractorNumber"
                                type="text"
                                className="form-control"
                                placeholder="Enter 10-digit Contractor Number"
                                maxLength={10}
                                value={contractorNumber}
                                onChange={(e) =>
                                    setContractorNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                                }
                            />

                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="position" className="report-filter-label">
                            Position
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="position"
                                className="form-select"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                <option value="">Select Position</option>
                                {positions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
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
                        Contractor List
                    </h2>
                    <p className="text-muted mb-0">
                        Contractors saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted">Loading contractors...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Contractor Name</th>
                                    <th>Contractor Number</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {contractors.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No contractors found.
                                        </td>
                                    </tr>
                                ) : (
                                    contractors.map((item) => (
                                        <tr key={item.ContractorID}>
                                            <td>{item.ContractorID}</td>
                                            <td>{item.ContractorName}</td>
                                            <td>{item.ContractorNumber}</td>
                                            <td>{item.Position}</td>
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
