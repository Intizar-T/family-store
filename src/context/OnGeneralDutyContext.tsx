import { createContext } from "react";
import { OnDutyUsersType } from "../App";

export type OnGeneralDutyUserContextProps = {
  onGeneralDutyUsers: OnDutyUsersType[];
  setOnGeneralDutyUsers: (onDutyUsers: OnDutyUsersType[]) => void;
};

export default createContext<OnGeneralDutyUserContextProps>({
  onGeneralDutyUsers: [],
  setOnGeneralDutyUsers: () => undefined,
});
