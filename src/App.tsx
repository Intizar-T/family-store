import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import Login from "./login/Login";
import ProductList from "./product/ProductList";
import UserContext from "./context/UserContext";
import Header from "./header/Header";
import TasksContext from "./context/TasksContext";
import { WEBSOCKET } from "./api/APIs";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WebsocketContext from "./context/WebSocketContext";
import OnGeneralDutyContext from "./context/OnGeneralDutyContext";
import OnMealDutyContext from "./context/OnMealDutyContext";
import { Languages } from "./localization/initLocalization";
import CheckUser from "./login/CheckUser";
import useLoading from "./helpers/useLoading";
import useMessage from "./helpers/useMessage";

export type User = {
  id: string;
  subscribed: boolean;
  name: string;
  language: Languages;
} | null;

export type OnDutyUsersType = {
  id: string;
  name: string;
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
  const [onGeneralDutyUsers, setOnGeneralDutyUsers] = useState<
    OnDutyUsersType[]
  >([]);
  const [onMealDutyUsers, setOnMealDutyUsers] = useState<OnDutyUsersType[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const { lastMessage, readyState, sendMessage } = useWebSocket(WEBSOCKET);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();

  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem("userId");
      if (userId == null) {
        showLoginModal(true);
      } else {
        try {
          toggle(true);
          await CheckUser(
            setUser,
            setOnGeneralDutyUsers,
            setTasks,
            setOnMealDutyUsers
          );
          toggle(false);
        } catch (error) {
          toggle(false);
          const { message } = error as Error;
          toggleMessage(true, "error", message);
        }
      }
    })();
  }, []);

  const userState = useMemo(() => {
    return { user, setUser };
  }, [user]);

  const onGeneralDutyUserState = useMemo(() => {
    return { onGeneralDutyUsers, setOnGeneralDutyUsers };
  }, [onGeneralDutyUsers]);

  const onMealDutyUserState = useMemo(() => {
    return { onMealDutyUsers, setOnMealDutyUsers };
  }, [onMealDutyUsers]);

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
    <UserContext.Provider value={userState}>
      <TasksContext.Provider value={tasksState}>
        <WebsocketContext.Provider value={websocketState}>
          <OnGeneralDutyContext.Provider value={onGeneralDutyUserState}>
            <OnMealDutyContext.Provider value={onMealDutyUserState}>
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
                {loginModal && <Login showLoginModal={showLoginModal} />}
                <Loading />
                <Message />
              </Grid>
            </OnMealDutyContext.Provider>
          </OnGeneralDutyContext.Provider>
        </WebsocketContext.Provider>
      </TasksContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
