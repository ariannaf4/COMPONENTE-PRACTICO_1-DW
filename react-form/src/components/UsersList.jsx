import { useState, useEffect } from 'react';

const UsersList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refreshTrigger]);

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="users-list">
      <h3>Usuarios Registrados ({users.length})</h3>
      
      {users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <strong>{user.nombres} {user.apellidos}</strong>
              <p>DNI: {user.dni}</p>
              <p>Fecha: {new Date(user.fecha_nacimiento).toLocaleDateString()}</p>
              <p>Género: {user.genero}</p>
              <p>Ciudad: {user.ciudad}</p>
            </div>
            <div className="user-actions">
              <button onClick={() => onEdit(user)} className="edit-btn">
                Editar
              </button>
              <button onClick={() => onDelete(user)} className="delete-btn">
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
      
      <button onClick={loadUsers} className="refresh-btn">
        Actualizar Lista
      </button>
    </div>
  );
};

export default UsersList;