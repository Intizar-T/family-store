import { USER_URL } from "../api/APIs";
import { User } from "../App";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";

export type APIUsers = {
  name: {
    S: string;
  };
  device: {
    S: string;
  };
  createdProduct: {
    L: string[];
  };
  id: {
    N: string;
  };
};

export default async function CheckUser(device: string): Promise<User[]> {
  const users: APIUsers[] = await fetchWithErrorHandler(USER_URL, "json", {
    method: "GET",
  });
  return users
    .filter((user) => user["device"]["S"] === device)
    .map((user) => {
      return {
        name: user["name"]["S"],
        device: user["device"]["S"],
      };
    });
}
