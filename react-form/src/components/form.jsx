import { useState } from 'react';
import Input from './inputs';
import RadioButtons from './radiobuttons';
import Select from './selects';
import './form.css';

const Form = ({ editUser, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(editUser || {
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    ciudad: ''
  });

  const [message, setMessage] = useState('');
  const isEditing = !!editUser;

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `http://localhost:3000/api/usuarios/${editUser.id}`
        : 'http://localhost:3000/api/usuarios';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(isEditing ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        if (!isEditing) {
          setFormData({
            dni: '',
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            genero: '',
            ciudad: ''
          });
        }
        // Notificar éxito al componente padre
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error al procesar usuario');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  // Opciones para radio buttons y select
  const generoOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  const ciudadOptions = [
    'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 
    'Piura', 'Cusco', 'Huancayo', 'Tacna','Milagro','Guayaquil'
  ];

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Usuario' : 'Formulario de Usuario'}</h2>
      
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          label="DNI"
          maxLength="10"
          placeholder="CI. Máximo 10 dígitos"
        />

        <Input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          label="Nombres"
          placeholder="Nombres completos"
        />

        <Input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          label="Apellidos"
          placeholder="Apellidos completos"
        />

        <Input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          label="Fecha de Nacimiento"
        />

        <RadioButtons
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          options={generoOptions}
          label="Género"
        />

        <Select
          name="ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          options={ciudadOptions}
          label="Ciudad"
        />

        <button type="submit">
          {isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}
        </button>
        
        {isEditing && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default Form;