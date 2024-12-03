import React from 'react';
import '../styles/InputText.css'; 

function InputText({
  label,
  type = 'text',
  placeholder,
  name,
  id,
  value,
  onChange,
  rows, 
}) {
  return (
    <div className="input-text-group">
      {label && <label htmlFor={id}>{label}</label>}
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          className="input-text input-textarea" 
          value={value}
          onChange={onChange}
          rows={rows} 
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="input-text"
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  );
}

export default InputText;
