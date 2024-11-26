import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import kontekstu autoryzacji

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider> {/* Opakowanie całej aplikacji w AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);