import React from 'react';

export default function PrivacyPolicy() {
    return (
        <>
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-shield-lock" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Privacy Policy</h1>
                        <p className="text-muted mb-0">
                            Privacy and data protection information.
                        </p>
                    </div>
                </div>
            </div>

            <section className="panel legal-panel">
                <div className="legal-content">

                    <h2>Copyright Policy</h2>
                    <p>
                        Material on this portal may be freely reproduced in
                        any format or media, provided it is accurate and not
                        used misleadingly or in a derogatory manner. When
                        sharing, the source must be clearly acknowledged.
                        However, this permission does not apply to third-party
                        copyrighted content, for which separate authorization
                        must be obtained from the copyright holder.
                    </p>

                    <h2>Disclaimer</h2>
                    <p>
                        While the information on this website is provided with
                        care, Maharashtra Right to Public Services Act is not
                        responsible for how it is used or any resulting
                        consequences. In case of any confusion or inconsistency,
                        users should contact the relevant section or officer
                        for clarification.
                    </p>

                    <h2>Hyperlinking Policies</h2>
                    <p>
                        This portal contains links to external websites
                        managed by government and private organizations for
                        user convenience. Once you navigate to an external
                        site, its privacy and security policies apply. The
                        Maharashtra Right to Public Services Act is not
                        responsible for the accuracy, content, or reliability
                        of these linked sites and does not necessarily endorse
                        their views. The presence of a link on this portal does
                        not imply any official endorsement.
                    </p>

                    <h2>Privacy Policy</h2>
                    <p>
                        This portal does not collect personal information like
                        name, phone number, or email by default. It only logs
                        details such as IP address, browser type, operating
                        system, visit date, and visited pages for statistical
                        purposes. These logs are not linked to individuals
                        unless site security is threatened. User identities and
                        browsing activities remain private unless required by
                        law enforcement. If personal information is requested,
                        its purpose will be explained, and necessary security
                        measures will be taken to protect it.
                    </p>

                </div>
            </section>
        </>
    );
}