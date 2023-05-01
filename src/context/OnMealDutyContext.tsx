import { createContext } from "react";
import { OnDutyUsersType } from "../App";

export type OnMealDutyUserContextProps = {
  onMealDutyUsers: OnDutyUsersType[];
  setOnMealDutyUsers: (onDutyUsers: OnDutyUsersType[]) => void;
};

export default createContext<OnMealDutyUserContextProps>({
  onMealDutyUsers: [],
  setOnMealDutyUsers: () => undefined,
});
