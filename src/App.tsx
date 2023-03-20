import { Grid } from "@mui/material";
import React from "react";
import { useState } from "react";
import Login from "./Login";
import ProductList from "./ProductList";

function App() {
  const [user, setUser] = useState<string>("");
  return (
    <Grid container>
      {user === "" ? (
        <Login user={user} setUser={setUser} />
      ) : (
        <ProductList user={user} />
      )}
    </Grid>
  );
}

export default App;
