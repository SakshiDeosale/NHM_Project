import React from 'react';

export default function Settings() {
  const settings = [
    {
      name: 'Circle',
      icon: 'bi-diagram-3',
      path: '/setting/circle',
    },
    {
      name: 'District',
      icon: 'bi-geo-alt',
      path: '/setting/district',
    },
    {
      name: 'Scheme',
      icon: 'bi-folder2-open',
      path: '/setting/scheme',
    },
    {
      name: 'Add User',
      icon: 'bi-person-plus',
      path: '/setting/user',
    },
    {
      name: 'Contractor',
      icon: 'bi-person-workspace',
      path: '/setting/contractor',
    },
    {
      name: 'Add MLA/MP',
      icon: 'bi-person-vcard',
      path: '/setting/mla',
    },
    
  ];

  return (
    <>
      {/* Page Heading */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i className="bi bi-gear" aria-hidden="true"></i>
          </span>

          <div>
            <h1 className="h3 mb-1">Settings</h1>
            <p className="text-muted mb-0">
              Manage master information and system settings.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <section className="panel settings-panel">
        <div className="panel-header">
          <div>
            <h2 className="h5 mb-1 section-title">
              <i className="bi bi-sliders me-2" aria-hidden="true"></i>
              <span>Master Settings</span>
            </h2>

            <p className="text-muted mb-0">
              Select an option to manage the corresponding information.
            </p>
          </div>
        </div>

        <div className="settings-grid">
          {settings.map((item) => (
            <a
              href={item.path}
              className="settings-card"
              key={item.name}
            >
              <span className="settings-card-icon">
                <i className={`bi ${item.icon}`} aria-hidden="true"></i>
              </span>

              <span className="settings-card-content">
                <span className="settings-card-title">
                  {item.name}
                </span>

                <span className="settings-card-action">
                  Manage
                </span>
              </span>

              <span className="settings-card-arrow">
                <i className="bi bi-arrow-right"></i>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}