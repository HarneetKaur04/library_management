import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AdminStatusProvider } from './AdminStatusContext';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
      <AdminStatusProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AdminStatusProvider>
    </Router>
  );