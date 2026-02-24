import React, { createContext, useState } from 'react';

// Creamos el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Creamos el proveedor que envolverá la aplicación

export const AuthProvider = ({ children }) => {
    // Inicializamos el estado leyendo el localStorage por si el usuario recarga la página
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [rol, setRol] = useState(localStorage.getItem('rol') || null);

    const login = (nuevoToken, nuevoRol) => {
        localStorage.setItem('token', nuevoToken);
        localStorage.setItem('rol', nuevoRol);
        setToken(nuevoToken);
        setRol(nuevoRol);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        setToken(null);
        setRol(null);
    };

    return (
        <AuthContext.Provider value={{ token, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};