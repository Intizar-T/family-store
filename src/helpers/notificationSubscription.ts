import { SUBSCRIPTION_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "./fetchWithErrorHandles";

const publicVapidKey =
  "BLwFnMhO1kiK0tDNsj7N_ke7KvQKfNo1evw-CUOSEuho0wFEiPdCJd1AvIInEMuIsKoMr0gvxgLtpl60Zj6kdEE";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = async (id: string) => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/family-store/service-worker.js"
      );
      if (registration.active) {
        await Notification.requestPermission(async (result) => {
          if (result === "granted") {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
            });
            await fetchWithErrorHandler(SUBSCRIPTION_URL, {
              method: "POST",
              body: JSON.stringify({
                subscription,
                id,
              }),
            });
            registration.showNotification(
              "Habarlashyga yazyldyn/yz. Indi kim magazina birzat koshsa soobsheniya geladi shundey"
            );
          }
        });
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

export const laptopNotification = async (message: string) => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification(message);
  } else {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
};
