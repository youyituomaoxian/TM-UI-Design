import React from 'react';
import ReactDOM from 'react-dom/client';
import CncDashboard from './pages/CncDashboard';
import '../styles/globals.css';
import '../styles/components.css';
import '../styles/framework.css';
import '../styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CncDashboard />
  </React.StrictMode>
);
