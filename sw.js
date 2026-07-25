const CACHE = 'londra2026-v24';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-180x180.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap',
  '/Biglietti/natural-history-museum.pdf',
  '/Biglietti/science-museum.pdf',
  '/Biglietti/warner-bros-harry-potter.pdf',
  '/Biglietti/national-gallery.pdf',
  '/Biglietti/osteria-locatelli.pdf',
  '/Biglietti/british-museum.pdf',
  '/Biglietti/historic-royal-palace.pdf',
  '/Biglietti/madame-tussauds.pdf',
  '/Biglietti/sealife-london.pdf'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Network-first per l'HTML: online prende sempre l'ultima versione,
    // offline usa la cache. Evita di servire versioni vecchie all'avvio.
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(c => c || caches.match('/index.html')))
    );
  } else {
    // Cache-first per gli asset statici (PDF, font, icone)
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
  }
});
