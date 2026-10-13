import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

    const handleChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFilter = (field) => {
        console.log(`${field}:`, filters[field]);

        // Backend/API filtering will be added later.
    };

    const filterFields = [
        {
            key: 'circle',
            label: 'Circle',
            type: 'select',
            options: ['Select Circle', 'Kokan', 'Pune', 'Nashik', 'Latur', 'Aurangabad', 'Akola', 'Nagpur', 'Nagpur (Ele)']
        },
        {
            key: 'budgetYear',
            label: 'Budget Year',
            type: 'select',
            options: [
                'Select Budget Year',
                '2026-27',
                '2025-26',
                '2024-25',
                '2023-24'
            ]
        },
        {
            key: 'workApprovalYear',
            label: 'Work Approval Year',
            type: 'select',
            options: [
                'Select Approval Year',
                '2026-27',
                '2025-26',
                '2024-25',
                '2023-24'
            ]
        },
        {
            key: 'district',
            label: 'District',
            type: 'select',
            options: [
                'Select District',

                'Ahilyanagar',
                'Akola',
                'Amravati',
                'Beed',
                'Bhandara',
                'Buldhana',
                'Aurangabad',
                'Chandrapur',
                'Dhule',
                'Dharashiv',
                'Gadchiroli',
                'Gondia',
                'Hingoli',
                'Jalgaon',
                'Jalna',
                'Kolhapur',
                'Latur',
                'Mumbai City',
                'Mumbai Suburban',
                'Nagpur',
                'Nanded',
                'Nandurbar',
                'Nashik',
                'Palghar',
                'Parbhani',
                'Pune',
                'Raigad',
                'Ratnagiri',
                'Sangli',
                'Satara',
                'Sindhudurg',
                'Solapur',
                'Thane',
                'Wardha',
                'Washim',
                'Yavatmal'
            ]
        },
        {
            key: 'workName',
            label: 'Work Name',
            type: 'text',
            placeholder: 'Enter work name'
        },
        {
            key: 'executiveEngineer',
            label: 'Executive Engineer',
            type: 'text',
            placeholder: 'Enter Executive Engineer'
        },
        {
            key: 'deputyEngineer',
            label: 'Deputy Engineer',
            type: 'text',
            placeholder: 'Enter Deputy Engineer'
        },
        {
            key: 'juniorEngineer',
            label: 'Junior Engineer',
            type: 'text',
            placeholder: 'Enter Junior Engineer'
        },
        {
            key: 'mla',
            label: 'MLA',
            type: 'text',
            placeholder: 'Enter MLA name'
        },
        {
            key: 'mp',
            label: 'MP',
            type: 'text',
            placeholder: 'Enter MP name'
        },
        {
            key: 'civilContractor',
            label: 'Civil Contractor',
            type: 'text',
            placeholder: 'Enter Civil Contractor'
        },
        {
            key: 'electricalContractor',
            label: 'Electrical Contractor',
            type: 'text',
            placeholder: 'Enter Electrical Contractor'
        },
        {
            key: 'architect',
            label: 'Architect',
            type: 'text',
            placeholder: 'Enter Architect'
        },
        {
            key: 'furnitureContractor',
            label: 'Furniture Contractor',
            type: 'text',
            placeholder: 'Enter Furniture Contractor'
        },
        {
            key: 'workStatus',
            label: 'Work Status',
            type: 'select',
            options: [
                'Select Work Status',
                'Not Started',
                'In Progress',
                'Completed',
                'On Hold'
            ]
        }
    ];

    return (
        <>
            {/* =========================
          PAGE HEADING
      ========================== */}

            <div className="page-heading">
                <div className="page-heading-copy">

                    <span className="page-icon">
                        <i
                            className="bi bi-file-earmark-text"
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="eyebrow mb-1">
                            Reports / {categoryName}
                        </p>

                        <h1 className="h3 mb-1">
                            {schemeName}
                        </h1>

                        <p className="text-muted mb-0">
                            Select filters to view {schemeName} reports.
                        </p>
                    </div>

                </div>
            </div>


            {/* =========================
          FILTER PANEL
      ========================== */}

            <section className="panel report-filter-panel">

                <div className="panel-header">

                    <div>
                        <h2 className="h5 mb-1 section-title">
                            <i
                                className="bi bi-funnel me-2"
                                aria-hidden="true"
                            />

                            <span>
                                Report Filters
                            </span>
                        </h2>

                        <p className="text-muted mb-0">
                            Select or enter the required information and click OK.
                        </p>
                    </div>

                </div>


                {/* =========================
            FILTER FIELDS
        ========================== */}

                <div className="report-filter-list">

                    {filterFields.map((field) => (

                        <div
                            className="report-filter-row"
                            key={field.key}
                        >

                            {/* Label */}

                            <label
                                htmlFor={field.key}
                                className="report-filter-label"
                            >
                                {field.label}
                            </label>


                            {/* Input */}

                            <div className="report-filter-control">

                                {field.type === 'select' ? (

                                    <select
                                        id={field.key}
                                        className="form-select"
                                        value={filters[field.key]}
                                        onChange={(e) =>
                                            handleChange(
                                                field.key,
                                                e.target.value
                                            )
                                        }
                                    >

                                        {field.options.map((option) => (
                                            <option
                                                key={option}
                                                value={
                                                    option.startsWith('Select')
                                                        ? ''
                                                        : option
                                                }
                                            >
                                                {option}
                                            </option>
                                        ))}

                                    </select>

                                ) : (

                                    <input
                                        id={field.key}
                                        type="text"
                                        className="form-control"
                                        placeholder={field.placeholder}
                                        value={filters[field.key]}
                                        onChange={(e) =>
                                            handleChange(
                                                field.key,
                                                e.target.value
                                            )
                                        }
                                    />

                                )}

                            </div>


                            {/* OK Button */}

                            <button
                                type="button"
                                className="btn btn-primary report-filter-ok"
                                onClick={() => handleFilter(field.key)}
                            >
                                OK
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* =========================
          BACK BUTTON
      ========================== */}

            <div className="mt-3">

                <Link
                    to={`/report/${category}`}
                    className="btn btn-light"
                >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Schemes
                </Link>

            </div>
        </>
    );
}