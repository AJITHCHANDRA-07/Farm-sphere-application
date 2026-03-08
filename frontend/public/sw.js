const CACHE_NAME = 'farmsphere-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching files:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        console.log('🗑️ Service Worker: Old caches:', keys);
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('🗑️ Service Worker: Deleting cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  console.log('🌐 Service Worker: Fetching:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('✅ Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise fetch from network
        console.log('🌐 Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((fetchResponse) => {
            // Cache successful network requests
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return fetchResponse;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Fetch failed:', error);
            // Return a basic offline page for HTML requests
            if (event.request.destination === 'document') {
              return new Response(
                `<!DOCTYPE html>
                <html>
                  <head>
                    <title>FarmSphere - Offline</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                            margin: 0; padding: 40px; text-align: center; 
                            background: linear-gradient(135deg, #16a34a, #10b981); 
                            color: white; min-height: 100vh; }
                      .offline-container { max-width: 400px; margin: 0 auto; }
                      .offline-icon { font-size: 64px; margin-bottom: 20px; }
                      h1 { margin: 0 0 10px 0; font-size: 24px; }
                      p { margin: 0 0 20px 0; opacity: 0.8; }
                      .retry-btn { background: white; color: #16a34a; border: none; 
                                   padding: 12px 24px; border-radius: 8px; 
                                   font-size: 16px; font-weight: 600; cursor: pointer;
                                   text-decoration: none; display: inline-block; }
                    </style>
                  </head>
                  <body>
                    <div class="offline-container">
                      <div class="offline-icon">🌾</div>
                      <h1>You're Offline</h1>
                      <p>FarmSphere is currently unavailable. Please check your internet connection.</p>
                      <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
                    </div>
                  </body>
                </html>`,
                { 
                  status: 200, 
                  statusText: 'OK',
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            }
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync operations here
      console.log('🔄 Service Worker: Processing background sync')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push notification received:', event);
  const options = {
    body: event.data ? event.data.text() : 'New notification from FarmSphere',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FarmSphere', options)
  );
});

// Message handler for communication from app
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚀 Service Worker: Loaded and ready');
