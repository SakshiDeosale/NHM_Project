import React from 'react';

export default function Charts() {
  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-bar-chart-line" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Analytics</p>
            <h1 className="h3 mb-1">Charts</h1>
            <p className="text-muted mb-0">Visualize revenue, channels, and operating performance.</p>
          </div>
        </div>
      </div>

      <section className="row g-3 mt-1">
        <div className="col-12 col-xl-8">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-bar-chart-line me-2" aria-hidden="true" />
                  <span>Revenue Trend</span>
                </h2>
                <p className="text-muted mb-0">Static chart component ready for Chart.js integration.</p>
              </div>
            </div>
            <div className="chart-bars" aria-label="Revenue chart">
              <div className="chart-column bar-42"><span></span><small>Jan</small></div>
              <div className="chart-column bar-58"><span></span><small>Feb</small></div>
              <div className="chart-column bar-51"><span></span><small>Mar</small></div>
              <div className="chart-column bar-72"><span></span><small>Apr</small></div>
              <div className="chart-column bar-66"><span></span><small>May</small></div>
              <div className="chart-column bar-83"><span></span><small>Jun</small></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-pie-chart me-2" aria-hidden="true" />
                  <span>Channel Mix</span>
                </h2>
                <p className="text-muted mb-0">Revenue contribution by source.</p>
              </div>
            </div>
            <div className="donut-chart mx-auto text-center py-4">
              <div className="display-4 fw-bold text-primary">68%</div>
            </div>
            <div className="legend-list mt-2">
              <div className="d-flex align-items-center justify-content-between py-1 border-bottom">
                <span><span className="legend-dot bg-primary d-inline-block rounded-circle me-2" style={{ width: '10px', height: '10px' }} />Direct sales</span>
                <strong>42%</strong>
              </div>
              <div className="d-flex align-items-center justify-content-between py-1 border-bottom">
                <span><span className="legend-dot bg-success d-inline-block rounded-circle me-2" style={{ width: '10px', height: '10px' }} />Marketplace</span>
                <strong>26%</strong>
              </div>
              <div className="d-flex align-items-center justify-content-between py-1 border-bottom">
                <span><span className="legend-dot bg-warning d-inline-block rounded-circle me-2" style={{ width: '10px', height: '10px' }} />Partners</span>
                <strong>18%</strong>
              </div>
              <div className="d-flex align-items-center justify-content-between py-1">
                <span><span className="legend-dot bg-danger d-inline-block rounded-circle me-2" style={{ width: '10px', height: '10px' }} />Other</span>
                <strong>14%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
