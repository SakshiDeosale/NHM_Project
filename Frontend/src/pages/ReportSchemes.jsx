import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

export default function ReportSchemes() {
    const { category } = useParams();

    const schemes = [
        {
            name: 'NHM',
            icon: 'bi-heart-pulse'
        },
        {
            name: '15th Finance',
            icon: 'bi-bank'
        },
        {
            name: 'PM-ABHIM',
            icon: 'bi-hospital'
        },
        {
            name: 'PMJVK',
            icon: 'bi-building'
        },
        {
            name: 'AYUSH',
            icon: 'bi-flower1'
        },
        {
            name: 'ADB',
            icon: 'bi-globe2'
        },
        {
            name: 'NDB',
            icon: 'bi-database'
        }
    ];

    const categoryName = {
        mrp: 'Master Reports',
        mr: 'Individual Reports',
        ar: 'Abstract Reports',
        'all-r': 'All Reports'
    };

    return (
        <>
            {/* Page Heading */}

            <div className="page-heading">
                <div className="page-heading-copy">

                    <span className="page-icon">
                        <i className="bi bi-file-earmark-bar-graph" />
                    </span>

                    <div>
                        <h1 className="h3 mb-1">
                            {categoryName[category] || 'Reports'}
                        </h1>

                        <p className="text-muted mb-0">
                            Select a scheme to view its reports.
                        </p>
                    </div>

                </div>
            </div>


            {/* Schemes */}

            <section className="panel">

                <div className="panel-header">

                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-folder2-open" aria-hidden="true" />

                        <span>
                            Schemes
                        </span>
                    </h2>

                    <p className="text-muted mb-0">
                        Select a scheme to continue.
                    </p>

                </div>


                <div className="scheme-grid">

                    
                    {schemes.map((scheme) => (
                        <NavLink
                            key={scheme.name}
                            to={`/report/${category}/${scheme.name
                                .toLowerCase()
                                .replace(/\s+/g, '-')}`}
                            className="scheme-card"
                        >
                            <span className="scheme-icon">
                                <i
                                    className={`bi ${scheme.icon}`}
                                    aria-hidden="true"
                                />
                            </span>

                            <span className="scheme-name">
                                {scheme.name}
                            </span>

                            <span className="scheme-arrow">
                                <i className="bi bi-arrow-right" aria-hidden="true" />
                            </span>
                        </NavLink>
                    ))}
                

                </div>

            </section>
        </>
    );
}