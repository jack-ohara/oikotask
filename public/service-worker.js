self.addEventListener("push", (event) => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "./logo_192x192.png",
      tag: data.tag ?? self.crypto.randomUUID(),
      actions: [{ action: "complete", title: "Mark completed" }],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  clients.openWindow("/schedule");

  // This looks to see if the current is already open and
  // focuses if it is
  // event.waitUntil(
  //   clients
  //     .matchAll({
  //       type: "window",
  //     })
  //     .then((clientList) => {
  //       for (const client of clientList) {
  //         if ("focus" in client) return client.focus();
  //       }
  //       if (clients.openWindow) return clients.openWindow("/schedule");
  //     })
  // );
});
