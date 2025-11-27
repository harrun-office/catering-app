// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/overrides.css'; // bundler-served CSS (prevents MIME type issues)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
