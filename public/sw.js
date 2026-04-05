// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', event => {
  const data = event.data.json();
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });
});
