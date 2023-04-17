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
  subscription: {
    S: string;
  };
};

export default async function CheckUser(device: string): Promise<User[]> {
  const users: APIUsers[] = await fetchWithErrorHandler(USER_URL, {
    method: "GET",
  });
  return users
    .filter((user) => {
      return parseInt(user["id"]["N"]) !== 0 && user["device"]["S"] === device;
    })
    .map((user: APIUsers) => {
      return {
        id: user.id.N,
        name: user.name.S,
        device: user.device.S,
        subscribed: user.subscription?.S == null ? false : true,
      };
    });
}
