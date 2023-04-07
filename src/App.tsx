import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import MenuBar from "./menu/MenuBar";
import ProductList from "./product/ProductList";
import UserContext from "./UserContext";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export type User = {
  name: string;
  device: string;
} | null;

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "service-worker.js"
      );
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

function App() {
  const [user, setUser] = useState<User>(null);
  const [loginModal, showLoginModal] = useState(false);
  const userAgent = window.navigator.userAgent;
  const device = userAgent.substring(
    userAgent.indexOf("(") + 1,
    userAgent.indexOf(")")
  );

  useEffect(() => {
    if (user != null) return;
    (async () => {
      const users: User[] = await Promise.all(await CheckUser(device));
      if (users.length !== 0) setUser(users[0]);
      else
        setTimeout(() => {
          showLoginModal(true);
        }, 1500);
    })();
  }, [user, device]);

  const userState = useMemo(() => {
    return { user, setUser };
  }, [user]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <UserContext.Provider value={userState}>
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
          <MenuBar />
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
    </UserContext.Provider>
  );
}

export default App;
