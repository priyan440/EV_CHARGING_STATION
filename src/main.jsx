import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { SystemStateProvider } from './contexts/SystemStateContext.jsx';
import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SystemStateProvider>
          <App />
        </SystemStateProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
