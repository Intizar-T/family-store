import { USER_URL } from "../api/APIs";
import { User } from "../App";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";

export default async function CheckUser(device: string): Promise<User[]> {
  const users: User[] = await fetchWithErrorHandler(USER_URL, "json", {
    method: "GET",
  });
  return users.filter((user) => user?.device === device);
}
