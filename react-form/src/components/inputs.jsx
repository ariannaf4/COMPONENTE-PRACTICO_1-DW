// Componente para inputs básicos con validaciones simples
const Input = ({ type, name, value, onChange, label, maxLength, placeholder, required = true }) => {
  
  // Validación simple para DNI
  const validateDNI = (value) => {
    if (name === 'dni') {
      const numericValue = value.replace(/\D/g, ''); // Solo números
      return numericValue.slice(0, 10); // Máximo 8 dígitos
    }
    return value;
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Aplicar validación específica
    if (name === 'dni') {
      newValue = validateDNI(newValue);
    }
    
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