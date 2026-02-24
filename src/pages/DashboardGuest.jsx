import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function DashboardGuest() {
    const { token } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState('');

    // useEffect se ejecuta automáticamente cuando el componente se carga en pantalla
    useEffect(() => {
        obtenerMisProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const obtenerMisProductos = async () => {
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

            // Agregamos dos variables locales al estado para manejar la vista de la moneda
            // sin alterar el dato original de la base de datos.
            const productosFormateados = data.map(p => ({
                ...p,
                precio_mostrado: p.precio,
                moneda_mostrada: 'MXN' // Moneda por defecto de tu sistema
            }));

            setProductos(productosFormateados);
        } catch (err) {
            setError(err.message);
        }
    };

    // Función que consume la API externa a través de tu backend
    const convertirDivisa = async (productoId, monedaDestino) => {
        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${productoId}/convertir/${monedaDestino}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'Error al convertir la divisa');
            }

            // Actualizamos solo el producto específico en el estado de React
            setProductos(productos.map(p => {
                if (p.id === productoId) {
                    return { 
                        ...p, 
                        precio_mostrado: data.precio_convertido, 
                        moneda_mostrada: data.moneda_destino 
                    };
                }
                return p;
            }));

        } catch (err) {
            alert(`Error de conversión: ${err.message}`);
        }
    };

    // Función auxiliar para renderizar el color del estado
    const colorEstado = (estado) => {
        switch(estado) {
            case 'aprobado': return '#27ae60'; // Verde
            case 'rechazado': return '#e74c3c'; // Rojo
            default: return '#f39c12'; // Naranja para pendiente
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>Mis Solicitudes de Productos</h2>
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {productos.length === 0 && !error ? (
                <p style={{ background: '#f9f9f9', padding: '20px', textAlign: 'center', borderRadius: '5px' }}>
                    No has creado ninguna solicitud todavía. Ve al Home para registrar un producto.
                </p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Nombre</th>
                            <th style={{ padding: '12px' }}>Tipo</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                            <th style={{ padding: '12px' }}>Precio</th>
                            <th style={{ padding: '12px' }}>Acciones (Divisa)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{producto.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{producto.nombre}</td>
                                <td style={{ padding: '12px' }}>{producto.tipo}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ background: colorEstado(producto.estado), color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {producto.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                    ${producto.precio_mostrado} {producto.moneda_mostrada}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {producto.moneda_mostrada === 'MXN' ? (
                                        <button 
                                            onClick={() => convertirDivisa(producto.id, 'COP')}
                                            style={{ background: '#f1c40f', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Ver en COP
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => convertirDivisa(producto.id, 'MXN')}
                                            style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Volver a MXN
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}