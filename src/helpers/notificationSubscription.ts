import { SUBSCRIPTION_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "./fetchWithErrorHandles";

export const notificationSubscription = async () => {
  await Notification.requestPermission(async (result) => {
    if (result === "granted") {
      const registration: ServiceWorkerRegistration = await navigator
        .serviceWorker.ready;
      // save subscription to db
      const subscription: PushSubscription =
        await registration.pushManager.subscribe();
      await fetchWithErrorHandler(SUBSCRIPTION_URL, {
        method: "POST",
        body: JSON.stringify({
          subscription,
        }),
      });
    }
  });
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
