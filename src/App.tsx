import { Grid } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import MenuBar from "./menu/MenuBar";
import ProductList from "./product/ProductList";
import UserContext from "./UserContext";

export type User = {
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
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          height: "100%",
          width: "100%",
        }}
      >
        <Grid item xs={1} sx={{ maxWidth: "100%", paddingX: 2 }}>
          <MenuBar />
        </Grid>
        <Grid item xs={11} sx={{ maxWidth: "100%" }}>
          <ProductList device={device} />
        </Grid>
        {loginModal && (
          <Login device={device} showLoginModal={showLoginModal} />
        )}
      </Grid>
    </UserContext.Provider>
  );
}

export default App;
