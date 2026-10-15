import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/reports';

const priorityColumns = [
    { key: 'ProjectID', label: 'Project ID' },
    { key: 'workId', label: 'Work ID' },
    { key: 'Circle', label: 'Circle' },
    { key: 'District', label: 'District' },
    { key: 'NameOfWork', label: 'Work Name' },
    { key: 'YearOfApproval', label: 'Approval Year' },
    { key: 'EEName', label: 'Executive Engineer' },
    { key: 'DEName', label: 'Deputy Engineer' },
    { key: 'JEName', label: 'Junior Engineer' },
    { key: 'MLAName', label: 'Member of Legislative Assembly (MLA)' },
    { key: 'MPName', label: 'Member of Parliament (MP)' },
    { key: 'ProjectCost', label: 'Project Cost' },
    { key: 'ActualStatus', label: 'Work Status' }
];

const columnLabels = {
    FMRCode: 'Financial Management Report Code (FMR Code)',
    AADate: 'Administrative Approval Date',
    AAAmount: 'Administrative Approval Amount',

    EEContact: 'Executive Engineer Contact Number',
    DEContact: 'Deputy Engineer Contact Number',
    JEContact: 'Junior Engineer Contact Number',

    MLAConstituency: 'MLA Constituency',
    MPConstituency: 'MP Constituency',

    CivilTSDate: 'Civil Technical Sanction Date',
    CivilTSAmount: 'Civil Technical Sanction Amount',
    CivilWODate: 'Civil Work Order Date',
    CivilWOAmount: 'Civil Work Order Amount',

    Architect: 'Architect Name',
    ArchitectWODate: 'Architect Work Order Date',
    ArchitectContact: 'Architect Contact Number',
    FeesPercent: 'Architect Fees Percentage',
    FeesPaid: 'Architect Fees Paid',

    Contractor: 'Civil Contractor Name',
    ContractorContact: 'Civil Contractor Contact Number',
    CivilTenderPercent: 'Civil Tender Percentage',
    CivilTenderType: 'Civil Tender Type',
    CivilExpenditure: 'Civil Work Expenditure',

    ElectricalContractor: 'Electrical Contractor Name',
    ElectricalContact: 'Electrical Contractor Contact Number',
    ElectricalTSDate: 'Electrical Technical Sanction Date',
    ElectricalTSAmount: 'Electrical Technical Sanction Amount',
    ElectricalWODate: 'Electrical Work Order Date',
    ElectricalWOAmount: 'Electrical Work Order Amount',
    ElectricalTenderPercent: 'Electrical Tender Percentage',
    ElectricalTenderType: 'Electrical Tender Type',
    ElectricalExpenditure: 'Electrical Work Expenditure',
    ElectricalStatus: 'Electrical Work Status',

    MGPSContractor: 'MGPS Contractor Name',
    MGPSContact: 'MGPS Contractor Contact Number',
    MGPSTSDate: 'MGPS Technical Sanction Date',
    MGPSTSAmount: 'MGPS Technical Sanction Amount',
    MGPSWODate: 'MGPS Work Order Date',
    MGPSWOAmount: 'MGPS Work Order Amount',
    MGPSTenderPercent: 'MGPS Tender Percentage',
    MGPSTenderType: 'MGPS Tender Type',
    MGPSExpenditure: 'MGPS Expenditure',
    MGPSStatus: 'MGPS Work Status',

    FurnitureContractor: 'Furniture Contractor Name',
    FurnitureContact: 'Furniture Contractor Contact Number',
    FurnitureTSDate: 'Furniture Technical Sanction Date',
    FurnitureTSAmount: 'Furniture Technical Sanction Amount',
    FurnitureWODate: 'Furniture Work Order Date',
    FurnitureWOAmount: 'Furniture Work Order Amount',
    FurnitureTenderPercent: 'Furniture Tender Percentage',
    FurnitureTenderType: 'Furniture Tender Type',
    FurnitureExpenditure: 'Furniture Expenditure',
    FurnitureStatus: 'Furniture Work Status',

    WaterSupplyStatus: 'Water Supply Status',
    TransformerStatus: 'Transformer Status',
    FireFightingStatus: 'Fire Fighting System Status',
    STPETPStatus: 'STP/ETP System Status',
    LiftStatus: 'Lift Status',
    HVACStatus: 'Heating, Ventilation and Air Conditioning (HVAC) Status',

    OtherExpenditure: 'Other Expenditure',
    Remarks: 'Remarks',
    CreatedAt: 'Record Created Date and Time',
    UpdatedAt: 'Record Last Updated Date and Time'
};

const formatColumnName = (column) => {
    if (columnLabels[column]) {
        return columnLabels[column];
    }

    return column
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .trim();
};

export default function SchemeReports() {
    const { category, scheme } = useParams();

    const categoryNames = {
        mrp: 'Master Reports',
        mr: 'Individual Reports',
        ar: 'Abstract Reports',
        'all-r': 'All Reports'
    };

    const schemeNames = {
        nhm: 'NHM',
        '15th-finance': '15th Finance',
        'pm-abhim': 'PM-ABHIM',
        pmjvk: 'PMJVK',
        ayush: 'AYUSH',
        adb: 'ADB',
        ndb: 'NDB'
    };

    const categoryName = categoryNames[category] || category;
    const schemeName = schemeNames[scheme] || scheme;

    const [filters, setFilters] = useState({
        circle: '',
        budgetYear: '',
        workApprovalYear: '',
        district: '',
        workName: '',
        executiveEngineer: '',
        deputyEngineer: '',
        juniorEngineer: '',
        mla: '',
        mp: '',
        civilContractor: '',
        electricalContractor: '',
        architect: '',
        furnitureContractor: '',
        workStatus: ''
    });

    const [options, setOptions] = useState({});
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadOptions = async () => {
            setOptionsLoading(true);
            setError('');

            try {
                const response = await fetch(`${API_BASE_URL}/options`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('Could not load dropdown options from the database.');
                }

                const data = await response.json();
                setOptions(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Failed to load dropdown options.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setOptionsLoading(false);
                }
            }
        };

        loadOptions();
        return () => controller.abort();
    }, []);

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFilter = async (field) => {
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const params = new URLSearchParams();

            // Send all currently selected filters so each OK button can
            // narrow the results using the selections made so far.
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    params.set(key, String(value));
                }
            });

            const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`);
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.message || 'Failed to retrieve report records.');
            }

            const data = await response.json();
            setReportData(data);
        } catch (err) {
            setError(err.message || 'Failed to retrieve report records.');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const filterFields = [
        { key: 'circle', label: 'Circle', optionsKey: 'circles', placeholder: 'Select Circle' },
        { key: 'budgetYear', label: 'Budget Year', optionsKey: 'budgetYears', placeholder: 'Select Budget Year' },
        { key: 'workApprovalYear', label: 'Work Approval Year', optionsKey: 'workApprovalYears', placeholder: 'Select Approval Year' },
        { key: 'district', label: 'District', optionsKey: 'districts', placeholder: 'Select District' },
        { key: 'workName', label: 'Work Name', optionsKey: 'workNames', placeholder: 'Select Work Name' },
        { key: 'executiveEngineer', label: 'Executive Engineer', optionsKey: 'executiveEngineers', placeholder: 'Select Executive Engineer' },
        { key: 'deputyEngineer', label: 'Deputy Engineer', optionsKey: 'deputyEngineers', placeholder: 'Select Deputy Engineer' },
        { key: 'juniorEngineer', label: 'Junior Engineer', optionsKey: 'juniorEngineers', placeholder: 'Select Junior Engineer' },
        { key: 'mla', label: 'MLA', optionsKey: 'mlas', placeholder: 'Select MLA' },
        { key: 'mp', label: 'MP', optionsKey: 'mps', placeholder: 'Select MP' },
        { key: 'civilContractor', label: 'Civil Contractor', optionsKey: 'civilContractors', placeholder: 'Select Civil Contractor' },
        { key: 'electricalContractor', label: 'Electrical Contractor', optionsKey: 'electricalContractors', placeholder: 'Select Electrical Contractor' },
        { key: 'architect', label: 'Architect', optionsKey: 'architects', placeholder: 'Select Architect' },
        { key: 'furnitureContractor', label: 'Furniture Contractor', optionsKey: 'furnitureContractors', placeholder: 'Select Furniture Contractor' },
        { key: 'workStatus', label: 'Work Status', optionsKey: 'workStatuses', placeholder: 'Select Work Status' }
    ];

    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-file-earmark-text" aria-hidden="true" />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">Reports / {categoryName}</p>
                        <h1 className="h3 mb-1">{schemeName}</h1>
                        {/* <p className="text-muted mb-0">
                            Select filters to view {schemeName} reports.
                        </p> */}
                    </div>
                </div>
            </div>

            <section className="panel report-filter-panel">
                <div className="panel-header">
                    <div>
                        <h2 className="h5 mb-1 section-title">
                            <i className="bi bi-funnel me-2" aria-hidden="true" />
                            <span>Report Filters</span>
                        </h2>
                        <p className="text-muted mb-0">
                            Select a value and click OK. Selected filters are combined.
                        </p>
                    </div>
                </div>

                {optionsLoading && (
                    <p className="text-muted px-3">Loading filter options from database...</p>
                )}

                <div className="report-filter-list">
                    {filterFields.map((field) => {
                        const fieldOptions = options[field.optionsKey] || [];

                        return (
                            <div className="report-filter-row" key={field.key}>
                                <label htmlFor={field.key} className="report-filter-label">
                                    {field.label}
                                </label>

                                <div className="report-filter-control">
                                    <select
                                        id={field.key}
                                        className="form-select"
                                        value={filters[field.key]}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        disabled={optionsLoading}
                                    >
                                        <option value="">{field.placeholder}</option>
                                        {fieldOptions.map((option) => (
                                            <option key={String(option)} value={String(option)}>
                                                {String(option)}
                                            </option>
                                        ))}
                                    </select>
                                    {!optionsLoading && fieldOptions.length === 0 && (
                                        <small className="text-muted">
                                            No values available in the database.
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary report-filter-ok"
                                    onClick={() => handleFilter(field.key)}
                                    disabled={loading || optionsLoading}
                                >
                                    OK
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="d-flex flex-wrap gap-2 p-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            setFilters({
                                circle: '', budgetYear: '', workApprovalYear: '', district: '',
                                workName: '', executiveEngineer: '', deputyEngineer: '',
                                juniorEngineer: '', mla: '', mp: '', civilContractor: '',
                                electricalContractor: '', architect: '', furnitureContractor: '',
                                workStatus: ''
                            });
                            setReportData([]);
                            setHasSearched(false);
                            setError('');
                        }}
                    >
                        <i className="bi bi-arrow-counterclockwise me-2" />
                        Clear Filters
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleFilter('all')}
                        disabled={loading || optionsLoading}
                    >
                        {loading ? 'Loading...' : 'Apply All Filters'}
                    </button>
                </div>
            </section>

            <section className="panel mt-4">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-table me-2" aria-hidden="true" />
                        NHM Report Results
                    </h2>
                    <p className="text-muted mb-0">
                        Records matching the selected filter values.
                    </p>
                </div>

                {error && <div className="alert alert-danger m-3">{error}</div>}

                {loading ? (
                    <div className="p-4 text-center">Loading records...</div>
                ) : (
                        <div className="table-responsive p-3">
                            <table className="table table-bordered table-hover align-middle nhm-report-table">
                                <thead>
                                    <tr>
                                        {priorityColumns.map((column) => (
                                            <th key={column.key} className="text-nowrap">
                                                {column.label}
                                            </th>
                                        ))}

                                        {reportData.length > 0 &&
                                            Object.keys(reportData[0])
                                                .filter(
                                                    (column) =>
                                                        column !== 'SrNo' &&
                                                        !priorityColumns.some(
                                                            (item) => item.key === column
                                                        )
                                                )
                                                .map((column) => (
                                                    <th key={column} className="text-nowrap">
                                                        {formatColumnName(column)}
                                                    </th>
                                                ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {!hasSearched ? (
                                        <tr>
                                            <td
                                                colSpan={73}
                                                className="text-center py-4"
                                            >
                                                Select a filter and click OK to view records.
                                            </td>
                                        </tr>
                                    ) : reportData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={73}
                                                className="text-center py-4"
                                            >
                                                No matching records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        reportData.map((row, index) => {
                                            const remainingColumns = Object.keys(row).filter(
                                                (column) =>
                                                    column !== 'SrNo' &&
                                                    !priorityColumns.some(
                                                        (item) => item.key === column
                                                    )
                                            );

                                            return (
                                                <tr key={row.ProjectID ?? index}>
                                                    {priorityColumns.map((column) => (
                                                        <td
                                                            key={column.key}
                                                            className="text-nowrap"
                                                        >
                                                            {row[column.key] == null ||
                                                                row[column.key] === ''
                                                                ? '-'
                                                                : String(row[column.key])}
                                                        </td>
                                                    ))}

                                                    {remainingColumns.map((column) => (
                                                        <td
                                                            key={column}
                                                            className="text-nowrap"
                                                        >
                                                            {row[column] == null ||
                                                                row[column] === ''
                                                                ? '-'
                                                                : String(row[column])}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            {hasSearched && (
                                <p className="text-muted mb-0">
                                    Total records: {reportData.length}
                                </p>
                            )}
                        </div>
                )}
            </section>

            <div className="mt-3">
                <Link to={`/report/${category}`} className="btn btn-light">
                    <i className="bi bi-arrow-left me-2" />
                    Back to Schemes
                </Link>
            </div>
        </>
    );
}
