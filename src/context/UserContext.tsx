import { createContext } from "react";
import { User } from "./../App";

export type UserProps = {
  user: User;
  setUser: (user: User) => void;
};

export default createContext<UserProps>({
  user: null,
  setUser: () => undefined,
});
