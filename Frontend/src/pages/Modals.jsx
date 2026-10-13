import React, { useState } from 'react';

export default function Modals() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [note, setNote] = useState('');

  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-window-stack" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Overlay</p>
            <h1 className="h3 mb-1">Modals</h1>
            <p className="text-muted mb-0">Modal dialogs for confirmations and compact workflows.</p>
          </div>
        </div>
      </div>

      <section className="row g-3">
        <div className="col-12 col-xl-6">
          <div className="panel h-100">
            <h2 className="h5 mb-3 section-title">
              <i className="bi bi-window-stack me-2" aria-hidden="true" />
              <span>Modal Examples</span>
            </h2>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary" type="button" onClick={() => setShowConfirmModal(true)}>
                Open Confirm Modal
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowFormModal(true)}>
                Open Form Modal
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="panel h-100">
            <h2 className="h5 mb-3 section-title">
              <i className="bi bi-info-circle me-2" aria-hidden="true" />
              <span>Usage</span>
            </h2>
            <p className="text-muted mb-0">
              Use modals for focused confirmations, compact forms, and high-priority decisions without leaving the page.
            </p>
          </div>
        </div>
      </section>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">Confirm Action</h2>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)} aria-label="Close" />
              </div>
              <div className="modal-body">This action will update the selected record.</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowConfirmModal(false)}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={(e) => { e.preventDefault(); setShowFormModal(false); }}>
                <div className="modal-header">
                  <h2 className="modal-title h5">Quick Note</h2>
                  <button type="button" className="btn-close" onClick={() => setShowFormModal(false)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <label className="form-label" htmlFor="modalNote">Note</label>
                  <textarea
                    className="form-control"
                    id="modalNote"
                    rows="4"
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowFormModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Note</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
