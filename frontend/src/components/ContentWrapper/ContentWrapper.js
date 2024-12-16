import React from 'react';
import './ContentWrapper.css';

const ContentWrapper = ({ children }) => {
  return <div className="content-section">{children}</div>;
};

export default ContentWrapper;
