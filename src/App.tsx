import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import ProductList from "./product/ProductList";
import UserContext from "./UserContext";
import Header from "./header/Header";
import OnDutyContext from "./OnDutyContext";
import TasksContext from "./TasksContext";
import { registerServiceWorker } from "./helpers/notificationSubscription";

export type User = {
  id: string;
  subscribed: boolean;
  name: string;
  device: string;
} | null;

export type OnDutyUsersType = {
  id: string;
  name: string;
  device: string;
  onDuty: "No" | "Pending" | string;
};

function App() {
  const [user, setUser] = useState<User>(null);
  const [loginModal, showLoginModal] = useState(false);
  const userAgent = window.navigator.userAgent;
  const device = userAgent.substring(
    userAgent.indexOf("(") + 1,
    userAgent.indexOf(")")
  );
  const [onDutyUsers, setOnDutyUsers] = useState<OnDutyUsersType[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    if (user != null) return;
    (async () => {
      const res = await CheckUser(setOnDutyUsers, setTasks, device);
      if (res == null) return;
      const users: User[] = await Promise.all(res);
      if (users.length !== 0) setUser(users[0]);
      else
        setTimeout(() => {
          showLoginModal(true);
        }, 1500);
      if (users[0] == null) return;
      await registerServiceWorker(users[0].id, false);
    })();
  }, [user, device]);

  const userState = useMemo(() => {
    return { user, setUser };
  }, [user]);

  const onDutyUserState = useMemo(() => {
    return { onDutyUsers, setOnDutyUsers };
  }, [onDutyUsers]);

  const tasksState = useMemo(() => {
    return {
      tasks,
      setTasks,
    };
  }, [tasks]);

  return (
    <OnDutyContext.Provider value={onDutyUserState}>
      <UserContext.Provider value={userState}>
        <TasksContext.Provider value={tasksState}>
          <Grid
            container
            sx={{
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <Grid
              item
              sx={{
                width: "100%",
                borderBottom: 1,
                borderColor: "divider",
                position: "absolute",
                height: 60,
              }}
            >
              <Header />
            </Grid>
            <Grid
              item
              sx={{
                width: "100%",
                height: "calc(100% - 60px)",
                position: "absolute",
                top: 60,
              }}
            >
              <ProductList />
            </Grid>
            {loginModal && (
              <Login device={device} showLoginModal={showLoginModal} />
            )}
          </Grid>
        </TasksContext.Provider>
      </UserContext.Provider>
    </OnDutyContext.Provider>
  );
}

export default App;
