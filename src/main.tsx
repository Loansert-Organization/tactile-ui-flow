
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simplified service worker registration (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('[PWA] Service Worker registration failed:', error);
      });
  });
}

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('[PWA] App is online');
});

window.addEventListener('offline', () => {
  console.log('[PWA] App is offline');
});

createRoot(document.getElementById("root")!).render(<App />);
