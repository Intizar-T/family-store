import { Grid } from "@mui/material";
import React from "react";
import { useState } from "react";
import Login from "./login/Login";
import ProductList from "./product/ProductList";

function App() {
  const [user, setUser] = useState<string>("");
  return (
    <Grid container sx={{ display: "flex", overflowY: "scroll" }}>
      {user === "" ? (
        <Login user={user} setUser={setUser} />
      ) : (
        <ProductList user={user} />
      )}
    </Grid>
  );
}

export default App;
