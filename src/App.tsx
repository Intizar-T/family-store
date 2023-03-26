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
    (async () => {
      const users: User[] = await Promise.all(await CheckUser(device));
      if (users.length !== 0) setUser(users[0]);
      else showLoginModal(true);
    })();
  }, [device]);

  useEffect(() => {
    if (user != null || loginModal === true) return;
    setTimeout(() => {
      showLoginModal(true);
    }, 1500);
  }, [user, loginModal]);

  const userState = useMemo(() => {
    return { user, setUser };
  }, [user]);

  return (
    <UserContext.Provider value={userState}>
      <Grid container sx={{ display: "flex", overflowY: "scroll" }}>
        <MenuBar />
        <ProductList device={device} />
        {loginModal && (
          <Login device={device} showLoginModal={showLoginModal} />
        )}
      </Grid>
    </UserContext.Provider>
  );
}

export default App;
