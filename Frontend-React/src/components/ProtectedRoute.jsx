import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        // Jeśli nie ma tokena, przekieruj do logowania
        return <Navigate to="/login" replace />;
    }

    // Jeśli jest token, wyświetl żądaną stronę
    return children;
};

export default ProtectedRoute;