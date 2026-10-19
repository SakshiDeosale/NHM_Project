import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchemeStatus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/dashboard/scheme-status"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch scheme status");
        }

        setUsers(result.data);
      } catch (err) {
        console.error("Failed to fetch scheme status:", err);
        setError(err.message || "Unable to load scheme status.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeStatus();
  }, []);

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i className="bi bi-speedometer2" aria-hidden="true" />
          </span>
          <div>
            <h1 className="h3 mb-1">Dashboard</h1>
            <p className="text-muted mb-0">
              Monitor all circle wise dashboard.
            </p>
          </div>
        </div>
        <div className="heading-actions"></div>
      </div>

      {/* Matric */}

      <section className="row g-3 mt-1" aria-label="Cities">
        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-primary">
            <div className="metric-label">
              Kokan
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-success">
            <div className="metric-label">
              Pune
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-warning">
            <div className="metric-label">
              Nashik
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-danger">
            <div className="metric-label">
              Latur
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-primary">
            <div className="metric-label">
              Aurangabad
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-success">
            <div className="metric-label">
              Akola
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-warning">
            <div className="metric-label">
              {" "}
              Nagpur
              <br />
              EE
            </div>
          </article>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <article className="metric-card metric-danger">
            <div className="metric-label">
              Nagpur(Ele)
              <br />
              EE
            </div>
          </article>
        </div>
      </section>

      {/* Scheme wise bar charts */}
      <section className="row g-3 mt-1">
        <div className="col-12 col-xl-12">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-graph-up-arrow me-2" aria-hidden="true" />
                  <span>Infrastructure Development Wing Schemes</span>
                </h2>
                <p className="text-muted mb-0">
                  Monitor all scheme wise bar chart
                </p>
              </div>
              {/* <Link className="btn btn-light btn-sm" to="/charts">
                View Details
              </Link> */}
            </div>

            <div className="chart-bars" aria-label="Sales performance chart">
              <div className="chart-column bar-42">
                <span></span>
                <small>NHM</small>
              </div>
              <div className="chart-column bar-58">
                <span></span>
                <small>15th Finance</small>
              </div>
              <div className="chart-column bar-51">
                <span></span>
                <small>PM-ABHIM</small>
              </div>
              <div className="chart-column bar-72">
                <span></span>
                <small>PMJVK</small>
              </div>
              <div className="chart-column bar-66">
                <span></span>
                <small>AYUSH</small>
              </div>
              <div className="chart-column bar-83">
                <span></span>
                <small>ADB</small>
              </div>
              <div className="chart-column bar-83">
                <span></span>
                <small>NDB</small>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <div className="panel-header">
              <div>
                <h2 className="h5 mb-1 section-title">
                  <i className="bi bi-activity me-2" aria-hidden="true" />
                  <span>Team Activity</span>
                </h2>
                <p className="text-muted mb-0">Recent operational updates.</p>
              </div>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot bg-primary" />
                <div>
                  <p className="mb-1 fw-semibold">New campaign launched</p>
                  <p className="text-muted small mb-0">
                    Marketing team published the May offer.
                  </p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot bg-success" />
                <div>
                  <p className="mb-1 fw-semibold">Payment batch cleared</p>
                  <p className="text-muted small mb-0">
                    246 invoices were processed successfully.
                  </p>
                </div>
              </div>
              <div className="activity-item">
                <span className="activity-dot bg-warning" />
                <div>
                  <p className="mb-1 fw-semibold">Support queue rising</p>
                  <p className="text-muted small mb-0">
                    Average first response time is 18 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
       */}
      </section>

      <section className="panel mt-3">
        <div className="panel-header">
          <div>
            <h2 className="h5 mb-1 section-title">
              <i className="bi bi-people me-2" aria-hidden="true" />
              <span>Recent Schemes Overview</span>
            </h2>
            <p className="text-muted mb-0">
              Latest Schemes activity across the workspace.
            </p>
          </div>
          {/* <Link className="btn btn-outline-secondary btn-sm" to="/users">
            Manage Users
          </Link> */}
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Schemes</th>
                <th scope="col">Complete</th>
                <th scope="col">Progress</th>
                <th scope="col">Not Started</th>
                <th scope="col">Cancelled</th>
                <th scope="col">Total</th>
              </tr>
            </thead>


            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading scheme status...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center text-danger py-4">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No scheme data available.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <p className="fw-semibold mb-0">{u.name}</p>
                    </td>
                    <td>{u.COMPLETE}</td>
                    <td>{u.PROGRESS}</td>
                    <td>{u["NOT STARTED"]}</td>
                    <td>{u.CANCELLED}</td>
                    <td>{u.TOTAL}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </section>
    </>
  );
}
