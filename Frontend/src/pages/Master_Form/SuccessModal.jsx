function SuccessModal({ open, onConfirm }) {
    if (!open) return null;

    return (
        <div className="success-overlay nhm-success-theme">
            <div
                className="success-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="success-title"
            >
                <div className="success-icon">
                    <svg
                        viewBox="0 0 24 24"
                        width="42"
                        height="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m5 12 4 4L19 6" />
                    </svg>
                </div>

                <h2 id="success-title">Success!</h2>
                <p>Your form has been submitted successfully.</p>

                <button type="button" onClick={onConfirm}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default SuccessModal;
        