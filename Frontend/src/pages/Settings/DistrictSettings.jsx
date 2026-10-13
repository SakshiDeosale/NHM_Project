
import React, { useState, useEffect } from 'react';

const DISTRICT_API = 'http://localhost:5000/api/districts';
const CIRCLE_API = 'http://localhost:5000/api/circles';

export default function DistrictSettings() {
    const [district, setDistrict] = useState('');
    const [circle, setCircle] = useState('');
    const [districts, setDistricts] = useState([]);
    const [circles, setCircles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Load circles and districts from the database
    const fetchData = async () => {
        try {
            setError('');

            const [circleResponse, districtResponse] = await Promise.all([
                fetch(CIRCLE_API),
                fetch(DISTRICT_API),
            ]);

            if (!circleResponse.ok || !districtResponse.ok) {
                throw new Error('Failed to load circles or districts.');
            }

            const circleData = await circleResponse.json();
            const districtData = await districtResponse.json();

            setCircles(circleData);
            setDistricts(districtData);
        } catch (err) {
            setError(err.message || 'Unable to load data. Check the backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add or update a district
    const handleSave = async () => {
        const districtName = district.trim();

        if (!districtName) {
            setError('Please enter a district name.');
            return;
        }

        if (!circle) {
            setError('Please select a circle.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const isEditing = editingId !== null;

            const response = await fetch(
                isEditing ? `${DISTRICT_API}/${editingId}` : DISTRICT_API,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        districtName,
                        circleID: Number(circle),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save district.');
            }

            setMessage(data.message || 'District saved successfully.');
            resetForm();
            await fetchData();
        } catch (err) {
            setError(err.message || 'Unable to save district.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setDistrict(item.DistrictName);
        setCircle(String(item.CircleID));
        setEditingId(item.DistrictID);
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setDistrict('');
        setCircle('');
        setEditingId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError('');
        setMessage('');
    };

    // Delete a district
    const handleDelete = async (item) => {
        if (!window.confirm(
            `Are you sure you want to delete "${item.DistrictName}"?`
        )) {
            return;
        }

        try {
            setError('');
            setMessage('');

            const response = await fetch(
                `${DISTRICT_API}/${item.DistrictID}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete district.');
            }

            setMessage(data.message || 'District deleted successfully.');

            if (editingId === item.DistrictID) {
                resetForm();
            }

            await fetchData();
        } catch (err) {
            setError(err.message || 'Unable to delete district.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">District</h1>
                        <p className="text-muted mb-0">
                            Add and manage District information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
                        {editingId !== null ? 'Edit District' : 'Add District'}
                    </h2>

                    <p className="text-muted mb-0">
                        Enter the District name and select its Circle.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label htmlFor="district" className="report-filter-label">
                            District
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="district"
                                type="text"
                                className="form-control"
                                placeholder="Enter District"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="circle" className="report-filter-label">
                            Circle
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="circle"
                                className="form-select"
                                value={circle}
                                onChange={(e) => setCircle(e.target.value)}
                            >
                                <option value="">Select Circle</option>

                                {circles.map((item) => (
                                    <option
                                        key={item.CircleID}
                                        value={item.CircleID}
                                    >
                                        {item.CircleName}
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
                        District List
                    </h2>
                    <p className="text-muted mb-0">
                        Districts saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted">Loading districts...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>District Name</th>
                                    <th>Circle</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {districts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No districts found.
                                        </td>
                                    </tr>
                                ) : (
                                    districts.map((item) => (
                                        <tr key={item.DistrictID}>
                                            <td>{item.DistrictID}</td>
                                            <td>{item.DistrictName}</td>
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
