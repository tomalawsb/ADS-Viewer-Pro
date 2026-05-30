const APP_VERSION_STAMP = "3005261415";
const CACHE_NAME = `ads-viewer-pro-${APP_VERSION_STAMP}`;
const ASSETS = [
  "./",
  `./index.html?v=${APP_VERSION_STAMP}`,
  `./styles.css?v=${APP_VERSION_STAMP}`,
  `./app.js?v=${APP_VERSION_STAMP}`,
  `./manifest.webmanifest?v=${APP_VERSION_STAMP}`,
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const freshRequest = new Request(request, { cache: "no-store" });
    const response = await fetch(freshRequest);
    if (response.ok || response.type === "opaque") {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isAppFile = url.origin === self.location.origin;
  const isStaticLibrary = url.hostname === "cdn.jsdelivr.net" && url.pathname.includes("/leaflet@");

  if (isAppFile) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (isStaticLibrary) {
    event.respondWith(cacheFirst(event.request));
  }
});


self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "Nowy alert ADS Viewer Pro" };
  }

  const title = payload.title || "ADS Viewer Pro";
  const options = {
    body: payload.body || payload.message || "Nowy alert samolotu.",
    icon: payload.icon || "./icon-192.png",
    badge: payload.badge || "./icon-192.png",
    tag: payload.tag || "ads-viewer-push-alert",
    renotify: true,
    data: { url: payload.url || "./" },
    vibrate: [180, 80, 180]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "./";

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientList) {
      if ("focus" in client) {
        await client.focus();
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
  })());
});
