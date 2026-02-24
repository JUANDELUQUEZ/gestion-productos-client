import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function DashboardAdmin() {
    const { token } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerTodosLosProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 1. Obtener TODOS los productos (el backend sabe que es admin por el token)
    const obtenerTodosLosProductos = async () => {
        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'Error al obtener los productos');
            }

            setProductos(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // 2. Actualizar el estado del producto (PUT)
    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'Error al actualizar estado');
            }

            // Actualizamos la tabla visualmente sin tener que recargar la página entera
            setProductos(productos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    // 3. Eliminar producto de la base de datos (DELETE)
    const eliminarProducto = async (id) => {
        // Regla técnica: Siempre pedir confirmación antes de una acción destructiva
        if (!window.confirm('¿Estás absolutamente seguro de eliminar esta solicitud? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'Error al eliminar');
            }

            // Filtramos el producto eliminado para sacarlo de la vista actual
            setProductos(productos.filter(p => p.id !== id));

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const colorEstado = (estado) => {
        switch(estado) {
            case 'aprobado': return '#27ae60';
            case 'rechazado': return '#e74c3c';
            default: return '#f39c12';
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #8e44ad', paddingBottom: '10px', color: '#8e44ad' }}>
                Panel de Control de Administrador
            </h2>
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {productos.length === 0 && !error ? (
                <p style={{ background: '#f9f9f9', padding: '20px', textAlign: 'center' }}>
                    No hay solicitudes registradas en el sistema.
                </p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#8e44ad', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>ID Usuario</th>
                            <th style={{ padding: '12px' }}>Nombre</th>
                            <th style={{ padding: '12px' }}>Tipo</th>
                            <th style={{ padding: '12px' }}>Precio (MXN)</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                            <th style={{ padding: '12px' }}>Acciones de Gestión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{producto.id}</td>
                                <td style={{ padding: '12px', color: '#7f8c8d' }}>Usuario #{producto.usuario_id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{producto.nombre}</td>
                                <td style={{ padding: '12px' }}>{producto.tipo}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>${producto.precio}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ background: colorEstado(producto.estado), color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {producto.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                    {producto.estado !== 'aprobado' && (
                                        <button 
                                            onClick={() => actualizarEstado(producto.id, 'aprobado')}
                                            style={{ background: '#27ae60', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Aprobar
                                        </button>
                                    )}
                                    {producto.estado !== 'rechazado' && (
                                        <button 
                                            onClick={() => actualizarEstado(producto.id, 'rechazado')}
                                            style={{ background: '#e67e22', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Rechazar
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => eliminarProducto(producto.id)}
                                        style={{ background: '#c0392b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}