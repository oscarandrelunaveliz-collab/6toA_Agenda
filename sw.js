self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Permite navegación normal
});

// EVENTO PUSH PARA ANDROID Y NAVEGADORES MÓVILES
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Nueva Tarea - 6to A';
  const options = {
    body: data.body || 'Se ha publicado una nueva tarea en la agenda.',
    icon: './Logo agenda-Photoroom.png',
    badge: './Logo agenda-Photoroom.png',
    vibrate: [200, 100, 200]
  };

  e.waitUntil(self.registration.showNotification(title, options));
});