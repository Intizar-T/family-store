import { createContext } from "react";

type TasksContextProps = {
  tasks: string[];
  setTasks: (tasks: string[]) => void;
};

export default createContext<TasksContextProps>({
  tasks: [],
  setTasks: () => undefined,
});
