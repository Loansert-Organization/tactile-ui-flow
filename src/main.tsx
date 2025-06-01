
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced PWA Service Worker Registration with Offline Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('[PWA] New service worker found, preparing to update...');
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[PWA] New version available');
                
                // Could show a toast or banner here
                if (confirm('A new version is available. Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });

        // Register for background sync when online
        if ('sync' in window.ServiceWorkerRegistration.prototype) {
          registration.sync.register('background-sync').catch((err) => {
            console.log('[PWA] Background sync registration failed:', err);
          });
        }
      })
      .catch((error) => {
        console.log('[PWA] Service Worker registration failed:', error);
      });
  });

  // Listen for service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[PWA] Message from service worker:', event.data);
    
    if (event.data?.type === 'SYNC_OFFLINE_DATA') {
      // Handle offline data sync
      console.log('[PWA] Syncing offline data...');
    }
  });
}

// Enhanced PWA Install Prompt Handler
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Handle PWA installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App was installed');
  deferredPrompt = null;
  
  // Could track installation analytics here
});

// Global function to trigger PWA install
(window as any).installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    deferredPrompt = null;
  }
};

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('[PWA] App is online');
  
  // Trigger background sync when coming back online
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      return registration.sync.register('background-sync');
    }).catch((err) => {
      console.log('[PWA] Background sync failed:', err);
    });
  }
});

window.addEventListener('offline', () => {
  console.log('[PWA] App is offline');
});

createRoot(document.getElementById("root")!).render(<App />);
