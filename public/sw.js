// ============================================
// CRM Pro V2 — Service Worker
// Offline caching with stale-while-revalidate
// ============================================

const CACHE_NAME = 'crm-pro-v2-cache-v1'
const OFFLINE_URL = '/offline'

// Static assets to pre-cache
const PRECACHE_URLS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
]

// Install: pre-cache essential resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS).catch(() => {
                // Silently fail if some URLs can't be cached
                console.log('[SW] Some precache URLs failed')
            })
        })
    )
    self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        })
    )
    self.clients.claim()
})

// Fetch: stale-while-revalidate for pages, cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // Skip Supabase API calls (auth, realtime)
    if (url.hostname.includes('supabase')) return

    // Skip API routes
    if (url.pathname.startsWith('/api')) return

    // Static assets: cache-first
    if (isStaticAsset(url.pathname)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
            })
        )
        return
    }

    // Pages: stale-while-revalidate
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
                .catch(() => {
                    // Return cached version or offline page
                    return cached || caches.match(OFFLINE_URL)
                })

            return cached || fetchPromise
        })
    )
})

function isStaticAsset(pathname) {
    return /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|eot)$/i.test(pathname) ||
        pathname.startsWith('/_next/static/')
}
