import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
      <Auth0ProviderWithHistory>
      <App />
      </Auth0ProviderWithHistory>
    </Router>
  );