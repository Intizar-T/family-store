import { USER_URL } from "../api/APIs";
import { OnDutyUsersType, User } from "../App";
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
  onDuty: {
    S: string;
  };
  tasks: {
    L: {
      S: string;
    }[];
  };
};

export default async function CheckUser(
  setOnDutyUsers?: (users: OnDutyUsersType[]) => void,
  setTasks?: (tasks: string[]) => void,
  device?: string
): Promise<User[] | undefined> {
  const users: APIUsers[] = await fetchWithErrorHandler(USER_URL, {
    method: "GET",
  });
  if (setOnDutyUsers != null)
    setOnDutyUsers(
      users
        .filter(({ onDuty }) => onDuty)
        .map(({ id, name, onDuty, device }) => {
          return {
            id: id["N"],
            name: name["S"],
            device: device["S"],
            onDuty: onDuty["S"],
          };
        })
    );

  if (setTasks != null)
    setTasks(
      users
        .filter(({ id }) => parseInt(id["N"]) === 1)
        .map(({ tasks }) => tasks["L"].map(({ S }) => S))[0]
    );

  if (device != null)
    return users
      .filter((user) => {
        return (
          parseInt(user["id"]["N"]) !== 0 &&
          parseInt(user["id"]["N"]) !== 1 &&
          user["device"]["S"] === device
        );
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
