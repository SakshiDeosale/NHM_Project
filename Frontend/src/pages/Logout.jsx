import React from 'react';

export default function Blank() {
  return (
    <>
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon"><i className="bi bi-file-earmark" aria-hidden="true" /></span>
          <div>
            <p className="eyebrow mb-1">Starter</p>
            <h1 className="h3 mb-1">Blank Page</h1>
            <p className="text-muted mb-0">Use this starter template to construct custom features.</p>
          </div>
        </div>
      </div>

      <div className="panel p-4 mt-2">
        <p className="text-muted mb-0">Start building your new React components here.</p>
      </div>
    </>
  );
}
