const CACHE_NAME = 'smart-travel-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline', // Must exist in pages or app dir
  '/icon-192x192.png',
  '/badge-72x72.png',
];

// Install event – pre-cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate SW immediately
});

// Activate event – clean old caches if needed
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// Fetch event – cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Don't cache POST requests or non-GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // API calls – network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req));
  } else {
    // Static – cache first
    event.respondWith(cacheFirst(req));
  }
});

// Cache-first strategy
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

// Network-first strategy with fallback
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached || caches.match('/offline');
  }
}

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    const response = await fetch('/api/travel-data');
    const data = await response.json();

    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/travel-data', new Response(JSON.stringify(data)));

    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.text() || 'New travel update available!';
  const options = {
    body: data,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
  };

  event.waitUntil(
    self.registration.showNotification('Smart Travel Assistant', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
