import React from 'react';

export default function Help() {
    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-question-circle" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Help</h1>
                        <p className="text-muted mb-0">
                            Contact information and support details.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel help-panel">
                <div className="help-content">
                    <h2>SWAPSOFT SGHITECH PVT.LTD <br />COMPANY, PUNE</h2>

                    <div className="help-item">
                        <strong>Address:</strong>
                        <p>
                            SGHI-TECH, Swedaganga Society,<br />
                            Pasaydan Building, Warje Pune,<br />
                            411058
                        </p>
                    </div>

                    <div className="help-item">
                        <strong>Phone 1:</strong>
                        <p>(+91) 9096408111</p>
                    </div>

                    <div className="help-item">
                        <strong>Phone 2:</strong>
                        <p>(+91) 9975408111</p>
                    </div>

                    <div className="help-item">
                        <strong>Email:</strong>
                        <p>info@sghitech.in</p>
                    </div>

                    <div className="help-item">
                        <strong>Website:</strong>
                        <p>www.sghitech.in</p>
                    </div>
                </div>
            </section>
        </>
    );
}