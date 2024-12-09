import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.css';

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <label className="checkbox-label">
      <input type="checkbox" className="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Checkbox;
