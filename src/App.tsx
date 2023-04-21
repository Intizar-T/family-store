import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import ProductList from "./product/ProductList";
import UserContext from "./UserContext";
import Header from "./header/Header";

export type User = {
  id: string;
  subscribed: boolean;
  name: string;
  device: string;
} | null;

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
    </UserContext.Provider>
  );
}

export default App;
