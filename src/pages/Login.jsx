import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    // Estados locales para los inputs y mensajes de error
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Hooks de React Router y Contexto
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        // Evitamos que la página se recargue al enviar el formulario (comportamiento por defecto de HTML)
        e.preventDefault();
        setError(''); // Limpiamos errores previos

        try {
            // Hacemos la petición a tu API real
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                // Si el backend devuelve un 401 o similar, mostramos el error
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Si el login es exitoso, guardamos el token y rol en la memoria global
            login(data.token, data.rol);

            // Redirección inteligente basada en el rol que devolvió la base de datos
            if (data.rol === 'admin') {
                navigate('/admin');
            } else {
                navigate('/guest');
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Iniciar Sesión</h2>
            
            {/* Si hay un error, lo mostramos en rojo */}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
}