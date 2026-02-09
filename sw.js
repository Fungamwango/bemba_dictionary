var CACHE_NAME = 'bemdic-v1';
var PRECACHE = [
  '/index.html',
  '/css/style.css?v=3',
  '/jquery/jquery-3.6.0.min.js',
  '/sage-js/sage-js.js',
  '/apps/apps/icon.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Network first for API calls
  if (e.request.url.indexOf('/api/') > -1) return;

  e.respondWith(
    fetch(e.request).then(function(resp) {
      // Cache successful GET responses
      if (resp.ok && e.request.method === 'GET') {
        var clone = resp.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return resp;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
