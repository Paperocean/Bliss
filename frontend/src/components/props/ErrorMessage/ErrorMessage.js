import React from 'react';

import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p className="error-message">{message}</p>;
};

export default ErrorMessage;
