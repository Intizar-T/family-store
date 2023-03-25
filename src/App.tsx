import { Backdrop, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import CheckUser from "./login/CheckUser";
import Login from "./login/Login";
import ProductList from "./product/ProductList";
import UserContext from "./UserContext";

export type User = {
  name: string;
  device: string;
} | null;

function App() {
  const [user, setUser] = useState<User>(null);
  const [loginModal, showLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const userAgent = window.navigator.userAgent;
  const device = userAgent.substring(
    userAgent.indexOf("(") + 1,
    userAgent.indexOf(")")
  );

  useEffect(() => {
    (async () => {
      const user: User[] = await Promise.all(await CheckUser(device));
      console.log(user);
      if (user.length !== 0) setUser(user[0]);
      else showLoginModal(true);
    })();
  }, [device]);

  const userState = useMemo(() => {
    return { user, setUser };
  }, [user]);

  return (
    <UserContext.Provider value={userState}>
      <Grid container sx={{ display: "flex", overflowY: "scroll" }}>
        <ProductList device={device} setLoading={setLoading} />
        {loginModal && (
          <Login
            device={device}
            showLoginModal={showLoginModal}
            setLoading={setLoading}
          />
        )}
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Grid>
    </UserContext.Provider>
  );
}

export default App;
