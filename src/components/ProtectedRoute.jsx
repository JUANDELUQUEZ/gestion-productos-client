import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ rolRequerido }) => {
    const { token, rol } = useContext(AuthContext);

    // Si no hay token, lo enviamos a iniciar sesión
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta exige un rol específico y el usuario no lo tiene, lo bloqueamos
    if (rolRequerido && rol !== rolRequerido) {
        return <Navigate to="/" replace />; 
    }

    // Si pasa las validaciones, renderiza el componente hijo correspondiente (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;