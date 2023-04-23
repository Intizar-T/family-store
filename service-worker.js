self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log(data);
  if (data.message != null) {
    const promiseChain = self.registration.showNotification(
      "Saytdan tazalyk:",
      {
        body: data.message,
      }
    );
    event.waitUntil(promiseChain);
  }
});

self.addEventListener("notificationclick", (event) => {
  const url = "https://intizar-t.github.io/family-store/";
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
