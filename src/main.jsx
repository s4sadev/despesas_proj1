import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('SW registrado com sucesso!'))
    .catch(err => console.error('Erro ao registrar SW:', err));
}
