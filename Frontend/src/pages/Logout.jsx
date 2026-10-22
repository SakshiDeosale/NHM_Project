
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    navigate('/login', { replace: true });
  };

  const handleCancel = () => {
    setShowPopup(false);
    navigate(-1);
  };

  return (
    <>
      {showPopup && (
        <div
          className="logout-overlay"
          role="presentation"
        >
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <div className="logout-icon">
              <i className="bi bi-box-arrow-right"></i>
            </div>

            <h5 id="logout-title">Confirm Logout</h5>

            <p>Are you sure you want to log out of your account?</p>

            <div className="logout-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
