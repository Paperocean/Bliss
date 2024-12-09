import React from 'react';
import PropTypes from 'prop-types';
import './InputField.css';

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  id,
  min,
  max,
}) => {
  return (
    <div className="input-text">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        className="input-field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'datetime-local',
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default InputField;
