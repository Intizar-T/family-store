self.addEventListener("push", (event) => {
  const data = event.data.json();
  const message = `Magazina ${data.user || "biri"} ${
    data.product || "produtka"
  } koshdy`;
  const promiseChain = self.registration.showNotification(message);
  event.waitUntil(promiseChain);
});
