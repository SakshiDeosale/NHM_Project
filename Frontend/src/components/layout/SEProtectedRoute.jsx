
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function SEProtectedRoute({ children }) {
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        user = null;
    }

    const designation = String(
        user?.designation ?? user?.Designation ?? ''
    ).trim().toLowerCase();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (designation !== 'superintending engineer') {
        return <Navigate to="/" replace />;
    }

    return children;
}
