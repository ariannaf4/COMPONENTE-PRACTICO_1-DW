import { useState } from 'react';
import Form from './components/form';
import UsersList from './components/UsersList';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [editUser, setEditUser] = useState(null);
  const [refreshUsers, setRefreshUsers] = useState(0);

  const showForm = () => {
    setCurrentView('form');
    setEditUser(null);
  };

  const showList = () => {
    setCurrentView('list');
    setRefreshUsers(prev => prev + 1); // Forzar actualización
  };

  const handleEdit = (user) => {
    // Formatear fecha para el input
    const formattedUser = {
      ...user,
      fechaNacimiento: new Date(user.fecha_nacimiento).toISOString().split('T')[0]
    };
    setEditUser(formattedUser);
    setCurrentView('form');
  };

  const handleDelete = async (user) => {
    if (confirm(`¿Eliminar a ${user.nombres} ${user.apellidos}?`)) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Usuario eliminado');
          setCurrentView('list'); // Refresh list
        }
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="app">
      <h1>Sistema de Usuarios</h1>
      
      <div className="nav">
        <button onClick={showForm} className={currentView === 'form' ? 'active' : ''}>
          {editUser ? 'Editar' : 'Nuevo Usuario'}
        </button>
        <button onClick={showList} className={currentView === 'list' ? 'active' : ''}>
          Ver Usuarios
        </button>
      </div>

      {currentView === 'form' ? (
        <Form 
          editUser={editUser} 
          onCancel={() => setCurrentView('list')}
          onSuccess={() => {
            setRefreshUsers(prev => prev + 1);
            // Opcionalmente cambiar a lista después de crear
            // setCurrentView('list');
          }}
        />
      ) : (
        <UsersList 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          refreshTrigger={refreshUsers}
        />
      )}
    </div>
  );
}

export default App;
