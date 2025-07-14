// Advanced Service Worker with Background Sync and Push Notifications

const CACHE_NAME = 'smart-travel-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const API_CACHE = 'api-v1';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

const API_ENDPOINTS = [
  '/api/travel-data',
  '/api/ping'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests (images, etc.)
  event.respondWith(handleDynamicRequest(request));
});

// API request handler - Network first, then cache
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful API responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return cached response if available
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'API request failed while offline' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Static asset handler - Cache first
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Navigation request handler - Network first with fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Try to get from cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline');
  }
}

// Dynamic request handler - Cache first with network fallback
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached version and update in background
    fetchAndUpdateCache(request, cache);
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Resource not available offline', { status: 404 });
  }
}

// Background cache update
async function fetchAndUpdateCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log('Background update failed:', error);
  }
}

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-travel-data') {
    event.waitUntil(syncTravelData());
  }
  
  if (event.tag === 'sync-user-preferences') {
    event.waitUntil(syncUserPreferences());
  }
});

async function syncTravelData() {
  try {
    // Get pending sync data from IndexedDB
    const pendingData = await getPendingData('travel-sync');
    
    if (pendingData.length > 0) {
      const responses = await Promise.all(
        pendingData.map(data => 
          fetch('/api/travel-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        )
      );
      
      // Clear synced data
      await clearPendingData('travel-sync');
      
      // Notify clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            data: { count: responses.length }
          });
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncUserPreferences() {
  try {
    const preferences = await getPendingData('preferences-sync');
    
    if (preferences.length > 0) {
      await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences[0])
      });
      
      await clearPendingData('preferences-sync');
    }
  } catch (error) {
    console.error('Preferences sync failed:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body || 'New travel information available',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Smart Travel Assistant', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// IndexedDB helpers
async function getPendingData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TravelAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function clearPendingData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TravelAppDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    };
  });
}

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-travel-updates') {
    event.waitUntil(syncTravelUpdates());
  }
});

async function syncTravelUpdates() {
  try {
    const response = await fetch('/api/travel-updates');
    if (response.ok) {
      const data = await response.json();
      
      // Show notification if there are important updates
      if (data.urgent) {
        self.registration.showNotification('Travel Alert', {
          body: data.message,
          icon: '/icon-192x192.png',
          tag: 'travel-alert'
        });
      }
    }
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Cache cleanup on storage limit
self.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage) {
    cleanupCaches();
  }
});

async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  const requests = await dynamicCache.keys();
  
  // Remove oldest entries if cache is too large
  if (requests.length > 100) {
    const oldestRequests = requests.slice(0, 20);
    await Promise.all(
      oldestRequests.map(request => dynamicCache.delete(request))
    );
  }
}