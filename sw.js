self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Permite que la app funcione normalmente
});

// AGREGAR ESTO PARA LAS NOTIFICACIONES:
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Nueva Tarea - 6to A';
  const options = {
    body: data.body || 'Se ha publicado una nueva tarea en la agenda.',
    icon: './Logo agenda-Photoroom.png', // Usamos tu ícono que está en la carpeta raíz
    badge: './Logo agenda-Photoroom.png'
  };

  e.waitUntil(self.registration.showNotification(title, options));
});