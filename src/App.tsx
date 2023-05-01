import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import ProductList from "./product/ProductList";
import UserContext from "./context/UserContext";
import Header from "./header/Header";
import OnDutyContext from "./context/OnDutyContext";
import TasksContext from "./context/TasksContext";
import { registerServiceWorker } from "./helpers/notificationSubscription";
import { WEBSOCKET } from "./api/APIs";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WebsocketContext from "./context/WebSocketContext";

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

export const websocketConnectionStatus = {
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

export const WEBSOCKET_MESSAGE = {
  postProduct: "POST_PRODUCT",
  update: "UPDATE",
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
  const { lastMessage, readyState, sendMessage } = useWebSocket(WEBSOCKET);

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

  const websocketState = useMemo(() => {
    return { lastMessage, readyState, sendMessage };
  }, [lastMessage, readyState, sendMessage]);

  return (
    <OnDutyContext.Provider value={onDutyUserState}>
      <UserContext.Provider value={userState}>
        <TasksContext.Provider value={tasksState}>
          <WebsocketContext.Provider value={websocketState}>
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
          </WebsocketContext.Provider>
        </TasksContext.Provider>
      </UserContext.Provider>
    </OnDutyContext.Provider>
  );
}

export default App;
