// Componente para selects
const Select = ({ name, value, onChange, options, label, required = true }) => {
  
  return (
    <div className="form-group">
      <label>{label}:</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Seleccionar {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;