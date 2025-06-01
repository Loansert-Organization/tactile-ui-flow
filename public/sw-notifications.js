
// Push notification handling for IKANISA PWA
// Separated for better maintainability

// Handle push notification events
export function handlePush(event) {
  console.log('[SW] Push message received');
  
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update available in your baskets',
    icon: '/icon-192.png',
    badge: '/favicon.ico',
    tag: 'ikanisa-notification',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1
    },
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'IKANISA', options)
  );
}

// Handle notification click events
export function handleNotificationClick(event) {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
}
