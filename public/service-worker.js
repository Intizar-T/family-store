self.addEventListener("push", (event) => {
  const data = event.data.json();
  let message = "";
  if (data?.product != null)
    message = `${data.user} sayta ${data.product} koshdy`;
  else
    message = `${data.user} hazyr magazina girjak bolotran. Garak zadynyzlary sayta yazynlar`;
  const promiseChain = self.registration.showNotification("Saytdan tazalyk:", {
    body: message,
  });
  event.waitUntil(promiseChain);
});
