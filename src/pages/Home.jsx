import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    // Obtenemos el token para saber si está logueado y para enviarlo a la API
    const { token } = useContext(AuthContext);
    
    // Estados del formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [disponibilidad, setDisponibilidad] = useState(true);
    const [precio, setPrecio] = useState('');
    
    // Estado para mostrar éxito o error al enviar
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inyección estricta del token
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    tipo,
                    disponibilidad,
                    precio: parseFloat(precio)
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.error || 'Error al crear la solicitud');
            }

            setMensaje({ texto: 'Solicitud creada con éxito. Puedes verla en tu Dashboard.', tipo: 'exito' });
            
            // Limpiar los campos tras el éxito
            setNombre(''); setDescripcion(''); setTipo(''); setPrecio(''); setDisponibilidad(true);

        } catch (error) {
            setMensaje({ texto: error.message, tipo: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            <section style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#2c3e50' }}>Bienvenido al Gestor de Productos</h1>
                <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
                    Esta plataforma está diseñada para optimizar la creación, el seguimiento y la administración de tu inventario. 
                    Envía tus solicitudes de nuevos productos llenando el formulario inferior. Una vez enviadas, un administrador evaluará la solicitud para su aprobación en el sistema.
                </p>
            </section>

            <section style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '20px' }}>Enviar Nueva Solicitud</h2>
                
                {/* Lógica de renderizado condicional basada en el Token */}
                {!token ? (
                    <div style={{ background: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '5px', border: '1px solid #ffeeba', textAlign: 'center' }}>
                        Debes <strong>iniciar sesión</strong> utilizando el botón en la parte superior derecha para poder registrar una solicitud.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {mensaje.texto && (
                            <div style={{ padding: '15px', marginBottom: '20px', background: mensaje.tipo === 'error' ? '#f8d7da' : '#d4edda', color: mensaje.tipo === 'error' ? '#721c24' : '#155724', borderRadius: '5px' }}>
                                <strong>{mensaje.tipo === 'error' ? 'Error: ' : 'Éxito: '}</strong> {mensaje.texto}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre del Producto:</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tipo / Categoría:</label>
                                <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción:</label>
                            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows="3" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio (Base MXN):</label>
                                <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Disponibilidad Inicial:</label>
                                <select value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value === 'true')} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                    <option value="true">Disponible</option>
                                    <option value="false">No Disponible</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
                            Registrar Solicitud
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
}