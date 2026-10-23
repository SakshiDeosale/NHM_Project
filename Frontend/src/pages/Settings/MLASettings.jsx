import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch } from "../../utils/api";

const API_URL = 'http://localhost:5000/api/mlamps';

const categoryOptions = {
    Amdar: ['VidhanSabha MLA', 'Vidhan Parishad MLA'],
    Khasdar: ['Lok Sabha MP', 'Rajya Sabha MP'],
};

const emptyForm = {
    type: '',
    category: '',
    name: '',
    constituency: '',
    party: '',
    state: 'Maharashtra',
};

export default function MLASettings() {
    const [form, setForm] = useState({ ...emptyForm });
    const [members, setMembers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchMembers = useCallback(async () => {
        try {
            setError('');
            const response = await apiFetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch MLA/MP records.');
            }

            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Unable to load records. Check the backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const updateField = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
            ...(key === 'type' ? { category: '' } : {}),
        }));
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setForm({ ...emptyForm });
        setEditingId(null);
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (!form.type || !form.category || !form.name.trim() || !form.state.trim()) {
            setError('Please complete all required fields.');
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
                    body: JSON.stringify({
                        type: form.type,
                        category: form.category,
                        name: form.name.trim(),
                        constituency: form.constituency.trim(),
                        party: form.party.trim(),
                        state: form.state.trim(),
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
        setForm({
            type: item.MemberType || '',
            category: item.Category || '',
            name: item.MemberName || '',
            constituency: item.Constituency || '',
            party: item.Party || '',
            state: item.State || 'Maharashtra',
        });
        setEditingId(item.ID);
        setError('');
        setMessage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        resetForm();
        setError('');
        setMessage('');
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(
            `Deactivate "${item.MemberName}"? This hides the record from active lists but retains it in the database.`
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            const response = await apiFetch(`${API_URL}/${item.ID}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to deactivate record.');
            }

            setMessage(data.message || 'Record deactivated successfully.');

            if (editingId === item.ID) {
                resetForm();
            }

            await fetchMembers();
        } catch (err) {
            setError(err.message || 'Unable to deactivate record.');
        }
    };

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-person-vcard" aria-hidden="true" />
                    </span>
                    <div>
                        <h1 className="h3 mb-1">Add MLA / MP</h1>
                        <p className="text-muted mb-0">
                            Add and manage MLA or MP information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i
                            className={`bi ${editingId !== null ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}
                            aria-hidden="true"
                        />
                        {editingId !== null ? 'Edit MLA / MP' : 'Add MLA / MP'}
                    </h2>
                    <p className="text-muted mb-0">
                        Fields marked with * are required.
                    </p>
                </div>

                <form className="p-3" onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-type" className="form-label">
                                Member Type *
                            </label>
                            <select
                                id="mla-type"
                                className="form-select"
                                value={form.type}
                                onChange={(e) => updateField('type', e.target.value)}
                                required
                            >
                                <option value="">Select Member Type</option>
                                <option value="Amdar">Amdar (MLA)</option>
                                <option value="Khasdar">Khasdar (MP)</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-category" className="form-label">
                                Category *
                            </label>
                            <select
                                id="mla-category"
                                className="form-select"
                                value={form.category}
                                onChange={(e) => updateField('category', e.target.value)}
                                disabled={!form.type}
                                required
                            >
                                <option value="">Select Category</option>
                                {(categoryOptions[form.type] || []).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-name" className="form-label">
                                Member Name *
                            </label>
                            <input
                                id="mla-name"
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                maxLength={200}
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-constituency" className="form-label">
                                Constituency
                            </label>
                            <input
                                id="mla-constituency"
                                type="text"
                                className="form-control"
                                placeholder="Enter constituency"
                                maxLength={150}
                                value={form.constituency}
                                onChange={(e) => updateField('constituency', e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-party" className="form-label">
                                Political Party
                            </label>
                            <input
                                id="mla-party"
                                type="text"
                                className="form-control"
                                placeholder="Enter political party"
                                maxLength={200}
                                value={form.party}
                                onChange={(e) => updateField('party', e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="mla-state" className="form-label">
                                State *
                            </label>
                            <input
                                id="mla-state"
                                type="text"
                                className="form-control"
                                placeholder="Enter state"
                                maxLength={100}
                                value={form.state}
                                onChange={(e) => updateField('state', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <i
                                className={`bi ${saving ? 'bi-hourglass-split' : editingId !== null ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}
                                aria-hidden="true"
                            />
                            {saving ? 'Saving...' : editingId !== null ? 'Update Record' : 'Add Record'}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {message && (
                        <div className="alert alert-success mt-3 mb-0" role="status">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger mt-3 mb-0" role="alert">
                            {error}
                        </div>
                    )}
                </form>
            </section>

            <section className="panel mt-4">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-list-ul me-2" aria-hidden="true" />
                        MLA / MP List
                    </h2>
                    <p className="text-muted mb-0">
                        Active records saved in the database.
                    </p>
                </div>

                {loading ? (
                    <p className="text-muted p-3 mb-0">Loading records...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Member Type</th>
                                    <th>Category</th>
                                    <th>Member Name</th>
                                    <th>Constituency</th>
                                    <th>Political Party</th>
                                    <th>State</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-4">
                                            No active MLA / MP records found.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((item) => (
                                        <tr key={item.ID}>
                                            <td>{item.ID}</td>
                                            <td>{item.MemberType}</td>
                                            <td>{item.Category}</td>
                                            <td>{item.MemberName}</td>
                                            <td>{item.Constituency || '—'}</td>
                                            <td>{item.Party || '—'}</td>
                                            <td>{item.State || '—'}</td>
                                            <td>
                                                <span className={`badge ${item.IsActive ? 'bg-success' : 'bg-secondary'}`}>
                                                    {item.IsActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-nowrap">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleEdit(item)}
                                                    aria-label={`Edit ${item.MemberName}`}
                                                >
                                                    <i className="bi bi-pencil-square me-1" aria-hidden="true" />
                                                    Edit
                                                </button>
                                                {/* <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(item)}
                                                    aria-label={`Deactivate ${item.MemberName}`}
                                                >
                                                    <i className="bi bi-person-dash me-1" aria-hidden="true" />
                                                    Deactivate
                                                </button> */}
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
