import { SEND_NOTIFICATION_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "./fetchWithErrorHandles";

export default async function notificationSender(
  userId: string,
  userName?: string,
  toBuy?: boolean,
  productName?: string
) {
  await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
    method: "POST",
    body: JSON.stringify({
      userId: userId,
      message: `${userName} ${
        toBuy ? "Almaly" : "Almalymy"
      } lista "${productName}" koshdy. ${
        toBuy ? "" : "Girip golosawat etmagi yatdan chykarman pwease"
      }`,
    }),
  });
}
