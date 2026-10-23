import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from "../utils/api";

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

const getColumnLabel = (key) => {
    const priorityColumn = priorityColumns.find(
        (column) => column.key === key
    );

    return priorityColumn?.label || formatColumnName(key);
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    // null means every database column is selected (except SrNo).
    const [selectedColumns, setSelectedColumns] = useState(null);
    const [allColumns, setAllColumns] = useState([]);

    // Fallback labels/priority columns appear while the backend columns load.
    const availableColumns = allColumns.length > 0
        ? allColumns
        : [...new Set([
            ...priorityColumns.map((column) => column.key),
            ...Object.keys(columnLabels)
        ])].filter((column) => column !== 'SrNo');

    const visibleColumns = availableColumns.filter(
        (column) => selectedColumns === null || selectedColumns.includes(column)
    );

    const handleColumnToggle = (column) => {
        const currentlySelected = selectedColumns === null
            ? availableColumns
            : selectedColumns;

        const updatedSelection = currentlySelected.includes(column)
            ? currentlySelected.filter((item) => item !== column)
            : [...currentlySelected, column];

        setSelectedColumns(updatedSelection);
    };

    const handleSelectAllColumns = () => setSelectedColumns(null);

    // Reset Default also shows every available database column.
    const handleResetColumns = () => setSelectedColumns(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadOptions = async () => {
            setOptionsLoading(true);
            setError('');

            try {
                const response = await apiFetch(
                    `${API_BASE_URL}/options?scheme=${encodeURIComponent(scheme)}`,
                    { signal: controller.signal }
                );

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

    useEffect(() => {
        const controller = new AbortController();

        const loadColumns = async () => {
            try {
                const response = await apiFetch(`${API_BASE_URL}/columns`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('Could not load report columns from the database.');
                }

                const data = await response.json();
                // Supports either ['ProjectID', ...] or { columns: ['ProjectID', ...] }.
                const columns = Array.isArray(data) ? data : data.columns;

                if (Array.isArray(columns)) {
                    const cleanedColumns = [...new Set(
                        columns.filter((column) => typeof column === 'string' && column !== 'SrNo')
                    )];
                    setAllColumns(cleanedColumns);
                    // null keeps all columns selected by default.
                    setSelectedColumns(null);
                } else {
                    throw new Error('The report columns endpoint returned an invalid response.');
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // Keep the fallback columns visible; report data can still load.
                    console.error('Unable to load report columns:', err);
                }
            }
        };

        loadColumns();
        return () => controller.abort();
    }, []);

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const fetchReport = async (
        currentPage = 1,
        currentPageSize = pageSize,
        selectedFilters = filters
    ) => {
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const params = new URLSearchParams();

            params.set('page', String(currentPage));
            params.set('pageSize', String(currentPageSize));
            params.set('scheme', scheme);

            Object.entries(selectedFilters).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    params.set(key, String(value));
                }
            });

            const response = await apiFetch(
                `${API_BASE_URL}/filter?${params.toString()}`
            );

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));

                throw new Error(
                    body.message || 'Failed to retrieve report records.'
                );
            }

            const result = await response.json();

            setReportData(Array.isArray(result.data) ? result.data : []);
            // If /columns is not available, include all fields returned by the report.
            if (!allColumns.length && Array.isArray(result.data) && result.data.length) {
                const dataColumns = [...new Set([
                    ...priorityColumns.map((column) => column.key),
                    ...Object.keys(result.data[0]).filter((column) => column !== 'SrNo')
                ])];
                setAllColumns(dataColumns);
            }
            setTotalRecords(result.total);
            setPage(result.page);
            setPageSize(result.pageSize);
            setTotalPages(result.totalPages);

        } catch (err) {
            setError(err.message || 'Failed to retrieve report records.');
            setReportData([]);
            setTotalRecords(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setPage(1);
        fetchReport(1, pageSize);
    };

    const handlePageChange = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            loading
        ) {
            return;
        }

        fetchReport(newPage, pageSize);
    };

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);

        setPageSize(newPageSize);
        setPage(1);

        fetchReport(1, newPageSize);
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
                            setPage(1);
                            setTotalRecords(0);
                            setTotalPages(0);
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
                        {schemeName} Report Results
                    </h2>
                    <p className="text-muted mb-0">
                        Records matching the selected filter values.
                    </p>
                </div>
                <div className="column-selector-wrapper">
                    <button
                        type="button"
                        className="btn btn-outline-primary column-selector-toggle"
                        onClick={() => setShowColumnSelector((prev) => !prev)}
                        aria-expanded={showColumnSelector}
                    >
                        <i className="bi bi-layout-three-columns me-2" />
                        Select Columns
                        <i
                            className={`bi ms-2 ${showColumnSelector
                                ? 'bi-chevron-up'
                                : 'bi-chevron-down'
                                }`}
                        />
                    </button>

                    {showColumnSelector && (
                        <div className="column-selector-panel">
                            <div className="column-selector-header">
                                <strong>Choose Visible Columns</strong>

                                <div className="column-selector-actions">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleSelectAllColumns}
                                    >
                                        Select All
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={handleResetColumns}
                                    >
                                        Reset Default
                                    </button>
                                </div>
                            </div>

                            <div className="column-checkbox-grid">
                                {availableColumns.map((column) => (
                                    <label
                                        key={column}
                                        className="column-checkbox-item"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedColumns === null ||
                                                selectedColumns.includes(column)
                                            }
                                            onChange={() => handleColumnToggle(column)}
                                        />

                                        <span>{getColumnLabel(column)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {error && <div className="alert alert-danger m-3">{error}</div>}

                {loading ? (
                    <div className="p-4 text-center">Loading records...</div>
                ) : (
                    <div className="table-responsive p-3">
                        <table className="table table-bordered table-hover align-middle nhm-report-table">
                            <thead>
                                <tr>
                                    {visibleColumns.map((column) => (
                                        <th key={column} className="text-nowrap">
                                            {getColumnLabel(column)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>


                            <tbody>
                                {!hasSearched ? (
                                    <tr>
                                        <td
                                            colSpan={Math.max(visibleColumns.length, 1)}
                                            className="text-center py-4"
                                        >
                                            Select a filter and click OK to view records.
                                        </td>
                                    </tr>
                                ) : reportData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={Math.max(visibleColumns.length, 1)}
                                            className="text-center py-4"
                                        >
                                            No matching records found.
                                        </td>
                                    </tr>
                                ) : visibleColumns.length === 0 ? (
                                    <tr>
                                        <td className="text-center py-4">
                                            Select at least one column to display report data.
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.map((row, index) => (
                                        <tr key={row.ProjectID ?? index}>
                                            {visibleColumns.map((column) => (
                                                <td key={column} className="text-nowrap">
                                                    {row[column] == null || row[column] === ''
                                                        ? '-'
                                                        : String(row[column])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {hasSearched && (
                            <div className="report-pagination">
                                <div className="pagination-info">
                                    Showing{' '}
                                    {totalRecords === 0
                                        ? 0
                                        : (page - 1) * pageSize + 1}
                                    {' - '}
                                    {Math.min(page * pageSize, totalRecords)}
                                    {' of '}
                                    {totalRecords} records
                                </div>

                                <div className="pagination-controls">
                                    <label htmlFor="reportPageSize">
                                        Rows per page:
                                    </label>

                                    <select
                                        id="reportPageSize"
                                        className="form-select"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        disabled={loading}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        disabled={page <= 1 || loading}
                                        onClick={() => handlePageChange(page - 1)}
                                    >
                                        <i className="bi bi-chevron-left me-1" />
                                        Previous
                                    </button>

                                    <span className="pagination-page">
                                        Page {totalRecords === 0 ? 0 : page} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        disabled={page >= totalPages || loading}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        Next
                                        <i className="bi bi-chevron-right ms-1" />
                                    </button>
                                </div>
                            </div>
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
