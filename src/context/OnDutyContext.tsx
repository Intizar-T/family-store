import { createContext } from "react";
import { OnDutyUsersType } from "../App";

export type OnDutyUserContextProps = {
  onDutyUsers: OnDutyUsersType[];
  setOnDutyUsers: (onDutyUsers: OnDutyUsersType[]) => void;
};

export default createContext<OnDutyUserContextProps>({
  onDutyUsers: [],
  setOnDutyUsers: () => undefined,
});
