self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.type) {
    return;
  }

  const title = data.title || 'Notification';
  const options = {
    body: data.body || '',
    icon: 'https://via.placeholder.com/128/0EA5E9/ffffff?text=el.js',
    badge: 'https://via.placeholder.com/64/22D3EE/ffffff?text=N',
    timestamp: Date.now()
  };

  if (data.type === 'SCHEDULE_NOTIFICATION') {
    if ('showTrigger' in Notification.prototype && 'TimestampTrigger' in self) {
      options.showTrigger = new TimestampTrigger(data.timestamp);
      options.tag = 'launch-schedule';
      return self.registration.showNotification(title, options);
    }
    console.warn('Notification Trigger tidak didukung di browser ini. Scheduling cancelled.');
    return;
  }

  if (data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(title, options);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});
