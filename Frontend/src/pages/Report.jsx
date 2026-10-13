import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Report() {

  const reportCategories = [
    {
      name: 'Master Reports',
      icon: 'bi-file-earmark-text',
      path: '/report/mrp'
    },
    {
      name: 'Individual Reports',
      icon: 'bi-file-earmark-text',
      path: '/report/mr'
    },
    {
      name: 'Abstract Reports',
      icon: 'bi-file-earmark-text',
      path: '/report/ar'
    },
    {
      name: 'All Reports',
      icon: 'bi-files',
      path: '/report/all-r'
    }
  ];

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">

          <span className="page-icon">
            <i className="bi bi-bar-chart-line" aria-hidden="true" />
          </span>

          <div>

            <h1 className="h3 mb-1">
              Reports
            </h1>

            <p className="text-muted mb-0">
              Select a report category to continue.
            </p>
          </div>

        </div>
      </div>


      <section className="panel">

        <div className="panel-header">

          <h2 className="h5 mb-1 section-title">
            <i className="bi bi-folder2-open" aria-hidden="true" />
            <span>Reports</span>
          </h2>

          <p className="text-muted mb-0">
            Select one of the available report categories.
          </p>

        </div>


        <div className="report-category-grid">

          {reportCategories.map((category) => (
            <NavLink
              to={category.path}
              className="report-category-card"
              key={category.name}
            >
              <span className="report-category-icon">
                <i
                  className={`bi ${category.icon}`}
                  aria-hidden="true"
                />
              </span>

              <span className="report-category-name">
                {category.name}
              </span>

              <span className="report-category-arrow">
                <i className="bi bi-arrow-right" aria-hidden="true" />
              </span>
            </NavLink>

          ))}

        </div>

      </section>
    </>
  );
}