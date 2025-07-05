// sw.js - Service Worker for PWA capabilities

const CACHE_NAME = 'mommycomic-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/comic-page.html', // Make sure this path is correct if your single comic page is named differently
  '/script.js',
  '/style.css', // If you have a separate stylesheet for all pages
  // Add paths to your images, especially static ones like icons, cover images etc.
  '/icons/icon-192x192.png', // Example path, adjust if your icons are elsewhere
  '/icons/icon-512x512.png', // Example path
  // Add placeholder images or common images used across pages
  'https://placehold.co/600x400/1e90ff/ffffff?text=Comic+Cover+1',
  'https://placehold.co/600x400/ff6347/ffffff?text=Comic+Cover+2',
  'https://placehold.co/600x400/32cd32/ffffff?text=Comic+Cover+3',
  'https://placehold.co/600x400/9370db/ffffff?text=Comic+Cover+4',
  'https://placehold.co/600x400/ffa500/ffffff?text=Comic+Cover+5',
  'https://placehold.co/600x400/4682b4/ffffff?text=Comic+Cover+6',
  'https://placehold.co/500x300/1e90ff/ffffff?text=Comic+Cover', // For single comic page cover
  'https://placehold.co/900x400/2a2a2a/cccccc?text=Panel+1', // Example comic panels
  'https://placehold.co/900x400/3a3a3a/dddddd?text=Panel+2',
  'https://placehold.co/900x400/2a2a2a/cccccc?text=Panel+3',
  'https://placehold.co/900x400/3a3a3a/dddddd?text=Panel+4',
  'https://placehold.co/900x400/2a2a2a/cccccc?text=Panel+5',

  // If you use an external stylesheet for ALL pages, link it here:
  // '/common-styles.css',
  // You might also cache fonts, etc.
];

// During the install phase, cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Cache addAll failed:', error);
      })
  );
});

// Intercept fetch requests and serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // If not in cache, fetch from network
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Service Worker: Fetch failed:', event.request.url, error);
        // You can return a fallback page here for offline requests that aren't cached
        // return caches.match('/offline.html');
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});