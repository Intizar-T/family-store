import { USER_URL } from "../api/APIs";
import { OnDutyUsersType, User } from "../App";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { Languages } from "../localization/initLocalization";

export type APIUsers = {
  name: {
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
  onGeneralDuty: {
    S: string;
  };
  onMealDuty: {
    S: string;
  };
  tasks: {
    L: {
      S: string;
    }[];
  };
  language: {
    S: Languages;
  };
};

export default async function CheckUser(
  setUser?: (user: User) => void,
  setOnGeneralDutyUsers?: (users: OnDutyUsersType[]) => void,
  setTasks?: (tasks: string[]) => void,
  setOnMealDutyUsers?: (users: OnDutyUsersType[]) => void
) {
  const users: APIUsers[] = await fetchWithErrorHandler(USER_URL, {
    method: "GET",
  });

  if (setOnGeneralDutyUsers != null)
    setOnGeneralDutyUsers(
      users
        .filter(({ onGeneralDuty }) => onGeneralDuty)
        .map(({ id, name, onGeneralDuty }) => {
          return {
            id: id["N"],
            name: name["S"],
            onDuty: onGeneralDuty["S"],
          };
        })
    );

  if (setOnMealDutyUsers != null)
    setOnMealDutyUsers(
      users
        .filter(({ onMealDuty }) => onMealDuty)
        .map(({ id, name, onMealDuty }) => {
          return {
            id: id.N,
            name: name.S,
            onDuty: onMealDuty.S,
          };
        })
    );

  if (setTasks != null)
    setTasks(
      users
        .filter(({ id }) => parseInt(id["N"]) === 1)
        .map(({ tasks }) => tasks["L"].map(({ S }) => S))[0]
    );

  if (setUser != null) {
    const userId = localStorage.getItem("userId");
    if (userId == null) return;
    const fetchedUser = users
      .filter((user) => {
        return user["id"]["N"] === userId;
      })
      .map((user: APIUsers) => {
        return {
          id: user.id.N,
          name: user.name.S,
          subscribed: user.subscription?.S == null ? false : true,
          language: user.language.S,
        };
      });
    if (fetchedUser.length === 0 || fetchedUser[0] == null)
      throw new Error("Akkauntynyzy almakda bir problema boldy");
    setUser(fetchedUser[0] as User);
  }
}
