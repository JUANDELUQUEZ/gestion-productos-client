import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import DashboardGuest from './pages/DashboardGuest';
import DashboardAdmin from './pages/DashboardAdmin';

// Subcomponente de Navegación para usar los hooks de React Router
const Navbar = () => {
    const { token, rol, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Lo devolvemos al home tras cerrar sesión
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#2c3e50', color: 'white', marginBottom: '30px' }}>
            <div>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>Gestor de Productos</Link>
            </div>
            <div>
                {!token ? (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '10px 20px', background: '#3498db', borderRadius: '5px', fontWeight: 'bold' }}>
                        Iniciar Sesión
                    </Link>
                ) : (
                    <>
                        <span style={{ marginRight: '20px', fontStyle: 'italic' }}>Rol: {rol}</span>
                        {rol === 'admin' ? (
                            <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '15px', fontWeight: 'bold' }}>Dashboard Admin</Link>
                        ) : (
                            <Link to="/guest" style={{ color: 'white', textDecoration: 'none', marginRight: '15px', fontWeight: 'bold' }}>Mis Solicitudes</Link>
                        )}
                        <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cerrar Sesión
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '0 30px' }}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/guest" element={<DashboardGuest />} />
            </Route>

            <Route element={<ProtectedRoute rolRequerido="admin" />}>
                <Route path="/admin" element={<DashboardAdmin />} />
            </Route>
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;