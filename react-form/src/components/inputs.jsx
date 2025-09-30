// Componente para inputs básicos con validaciones simples
const Input = ({ type, name, value, onChange, label, maxLength, placeholder, required = true }) => {
  
  // Validaciones simples por tipo de campo
  const validateInput = (value) => {
    if (name === 'dni') {
      // DNI: Solo números, máximo 10 dígitos
      const numericValue = value.replace(/\D/g, '');
      return numericValue.slice(0, 10);
    }
    
    if (name === 'nombres' || name === 'apellidos') {
      // Nombres y apellidos: Solo letras, espacios y acentos
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      return soloLetras.test(value) ? value : value.slice(0, -1);
    }
    
    return value;
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Aplicar validación específica
    newValue = validateInput(newValue);
    
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div className="form-group">
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;