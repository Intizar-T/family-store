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
