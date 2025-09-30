// Componente para radio buttons
const RadioButtons = ({ name, value, onChange, options, label, required = true }) => {
  
  return (
    <div className="form-group">
      <label>{label}:</label>
      <div className="radio-group">
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtons;