import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css'
import App from './App.jsx'


// Criar root apenas uma vez para evitar o erro anterior
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// Registrar Service Worker - SIMPLES
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('✅ Service Worker registrado!'))
      .catch(err => console.log('❌ Erro no Service Worker:', err));
  });
}