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


// Registrar Service Worker quando a página carregar
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registrado com sucesso!', registration.scope);
      
      // Verificar por atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Nova versão do Service Worker encontrada');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('📱 Nova versão disponível! Recarregue a página.');
            // Aqui você pode mostrar uma notificação para o usuário
          }
        });
      });
      
    } catch (error) {
      console.log('❌ Erro ao registrar Service Worker:', error);
    }
  });
}

// Detectar quando o app pode ser instalado
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💡 PWA pode ser instalado!');
  e.preventDefault();
  deferredPrompt = e;
  
  // Aqui você pode mostrar um botão customizado de instalação
  showInstallButton();
});

// Função para mostrar botão de instalação customizado
function showInstallButton() {
  // Criar botão de instalação
  const installButton = document.createElement('button');
  installButton.textContent = '📱 Instalar App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    z-index: 1000;
    transition: transform 0.2s;
  `;
  
  installButton.addEventListener('mouseenter', () => {
    installButton.style.transform = 'scale(1.05)';
  });
  
  installButton.addEventListener('mouseleave', () => {
    installButton.style.transform = 'scale(1)';
  });
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA foi instalado!');
      } else {
        console.log('❌ Usuário recusou a instalação');
      }
      
      deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.body.appendChild(installButton);
}

// Detectar quando o PWA foi instalado
window.addEventListener('appinstalled', () => {
  console.log('🎉 PWA foi instalado com sucesso!');
  deferredPrompt = null;
  
  // Remover botão de instalação se existir
  const installButton = document.querySelector('button');
  if (installButton && installButton.textContent.includes('Instalar')) {
    installButton.remove();
  }
});
