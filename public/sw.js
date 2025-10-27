const CACHE_NAME = 'scc-construct-pro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/scc-logo-192.png',
  '/scc-logo-512.png',
  '/scc-logo-72.png'
];

// Install event: cache the application shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use skipWaiting() to ensure the new service worker activates immediately.
        self.skipWaiting(); 
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve assets from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// Push Notification event listener
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Default Title', body: 'Default body' };
  const title = data.title || 'Stoney Creek Construction';
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/scc-logo-192.png',
    badge: '/scc-logo-72.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event listener
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Focus or open a window when the notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
