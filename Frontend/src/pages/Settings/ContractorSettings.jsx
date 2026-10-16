import React, { useCallback, useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/contractors';

const initialForm = {
    sourceSheet: '',
    srNo: '',
    contractorName: '',
    vendorClass: '',
    region: '',
    entryDate: '',
    position: 'Contractor',
};

const sourceSheetOptions = ['IA', 'IB', 'IC', 'II', 'III'];
const vendorClassOptions = [
    'Class I-A',
    'Class I-B',
    'Class I-C',
    'Class II',
    'Class III',
    'Class IB',
    'Class IC',
];
const positionOptions = [
    'Contractor',
    'Civil Contractor',
    'Electrical Contractor',
    'Furniture Contractor',
    'Architect',
];
const regionOptions = [
    'Konkan',
    'Kokan',
    'Pune',
    'Nashik',
    'Latur',
    'Chh. Sambhajinagar',
    'Nagpur',
    'Akola',
    'Thane',
    'Amravati',
];

export default function ContractorSettings() {
    const [form, setForm] = useState(initialForm);
    const [contractors, setContractors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchContractors = useCallback(async () => {
        try {
            setError('');
            const response = await fetch(API_URL);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch contractors.');
            }
            setContractors(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Unable to load contractors. Check the backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContractors();
    }, [fetchContractors]);

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!form.sourceSheet || !form.contractorName.trim() || !form.position) {
            setError('Please complete Source Sheet, Contractor Name, and Position.');
            return;
        }

        if (form.srNo !== '' && (!Number.isInteger(Number(form.srNo)) || Number(form.srNo) < 0)) {
            setError('Sr. No. must be a non-negative whole number.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const isEditing = editingId !== null;
            const payload = {
                sourceSheet: form.sourceSheet,
                srNo: form.srNo === '' ? null : Number(form.srNo),
                contractorName: form.contractorName.trim(),
                vendorClass: form.vendorClass,
                region: form.region,
                entryDate: form.entryDate.trim(),
                position: form.position,
            };

            const response = await fetch(
                isEditing ? `${API_URL}/${editingId}` : API_URL,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
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
        setForm({
            sourceSheet: item.SourceSheet ?? '',
            srNo: item.SrNo ?? '',
            contractorName: item.ContractorName ?? '',
            vendorClass: item.VendorClass ?? '',
            region: item.Region ?? '',
            entryDate: item.EntryDate ?? '',
            position: item.Position ?? '',
        });
        setEditingId(item.ID);
        setError('');
        setMessage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Are you sure you want to delete "${item.ContractorName}"?`)) return;

        try {
            setError('');
            setMessage('');
            const response = await fetch(`${API_URL}/${item.ID}`, { method: 'DELETE' });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to delete contractor.');
            }

            setMessage(data.message || 'Contractor deleted successfully.');
            if (editingId === item.ID) resetForm();
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
                        <h1 className="h3 mb-1">Contractor Information</h1>
                        <p className="text-muted mb-0">
                            Add and manage contractor records from the database.
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
                    <p className="text-muted mb-0">Enter all available contractor details.</p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="row g-3 p-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="sourceSheet" className="form-label">Source Sheet *</label>
                            <select id="sourceSheet" name="sourceSheet" className="form-select"
                                value={form.sourceSheet} onChange={updateField} required>
                                <option value="">Select Source Sheet</option>
                                {sourceSheetOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                {!sourceSheetOptions.includes(form.sourceSheet) && form.sourceSheet && (
                                    <option value={form.sourceSheet}>{form.sourceSheet}</option>
                                )}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="srNo" className="form-label">Sr. No.</label>
                            <input id="srNo" name="srNo" type="number" min="0" step="1"
                                className="form-control" placeholder="Enter serial number"
                                value={form.srNo} onChange={updateField} />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="contractorName" className="form-label">Contractor Name *</label>
                            <input id="contractorName" name="contractorName" type="text" maxLength={300}
                                className="form-control" placeholder="Enter contractor name"
                                value={form.contractorName} onChange={updateField} required />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="vendorClass" className="form-label">Vendor Class</label>
                            <select id="vendorClass" name="vendorClass" className="form-select"
                                value={form.vendorClass} onChange={updateField}>
                                <option value="">Select Vendor Class</option>
                                {vendorClassOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                {!vendorClassOptions.includes(form.vendorClass) && form.vendorClass && (
                                    <option value={form.vendorClass}>{form.vendorClass}</option>
                                )}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="region" className="form-label">Region</label>
                            <select id="region" name="region" className="form-select"
                                value={form.region} onChange={updateField}>
                                <option value="">Select Region</option>
                                {regionOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                {!regionOptions.includes(form.region) && form.region && (
                                    <option value={form.region}>{form.region}</option>
                                )}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="entryDate" className="form-label">Entry Date</label>
                            <input id="entryDate" name="entryDate" type="text" maxLength={50}
                                className="form-control" placeholder="e.g. 6.9.23 or 09-01-2026"
                                value={form.entryDate} onChange={updateField} />
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                            <label htmlFor="position" className="form-label">Position *</label>
                            <select id="position" name="position" className="form-select"
                                value={form.position} onChange={updateField} required>
                                <option value="">Select Position</option>
                                {positionOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                                {!positionOptions.includes(form.position) && form.position && (
                                    <option value={form.position}>{form.position}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 border-top p-3">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <i className={`bi ${editingId !== null ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                            {saving ? 'Saving...' : editingId !== null ? 'Update Contractor' : 'Add Contractor'}
                        </button>
                        {editingId !== null && (
                            <button type="button" className="btn btn-outline-secondary"
                                onClick={() => { resetForm(); setError(''); setMessage(''); }} disabled={saving}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {message && <p className="text-success px-3 pb-2 mb-0" role="status">{message}</p>}
                {error && <p className="text-danger px-3 pb-2 mb-0" role="alert">{error}</p>}
            </section>

            <section className="panel mt-4">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-list-ul me-2" aria-hidden="true"></i>
                        Contractor List
                    </h2>
                    <p className="text-muted mb-0">{contractors.length} record(s) in the database.</p>
                </div>

                {loading ? (
                    <p className="text-muted p-3">Loading contractors...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Source Sheet</th>
                                    <th>Sr. No.</th>
                                    <th>Contractor Name</th>
                                    <th>Vendor Class</th>
                                    <th>Region</th>
                                    <th>Entry Date</th>
                                    <th>Position</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contractors.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-4">No contractors found.</td></tr>
                                ) : contractors.map((item) => (
                                    <tr key={item.ID}>
                                        <td>{item.ID}</td>
                                        <td>{item.SourceSheet || '—'}</td>
                                        <td>{item.SrNo ?? '—'}</td>
                                        <td className="text-wrap" style={{ minWidth: 260 }}>{item.ContractorName}</td>
                                        <td>{item.VendorClass || '—'}</td>
                                        <td>{item.Region || '—'}</td>
                                        <td>{item.EntryDate || '—'}</td>
                                        <td>{item.Position || '—'}</td>
                                        <td className="text-nowrap">
                                            <button type="button" className="btn btn-sm btn-primary me-2"
                                                onClick={() => handleEdit(item)} aria-label={`Edit ${item.ContractorName}`}>
                                                <i className="bi bi-pencil-square me-1"></i>Edit
                                            </button>
                                            {/* <button type="button" className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(item)} aria-label={`Delete ${item.ContractorName}`}>
                                                <i className="bi bi-trash me-1"></i>Delete
                                            </button> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}
