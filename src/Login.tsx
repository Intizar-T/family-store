import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import LoginImage from "./images/login1.jpg";

// const users = {
//   rahim: "Rahim",
//   intizar: "Intizar",
//   ovadan: "Ovadan",
//   jennet: "Jennet",
//   hudayar: "Hudayar",
// };

interface LoginProps {
  user: string;
  setUser: (user: string) => void;
}

export default function Login({ user, setUser }: LoginProps) {
  return (
    <Grid
      container
      alignItems="center"
      sx={{
        height: "100vh",
        padding: 2,
        backgroundImage: `url(${LoginImage})`,
      }}
    >
      <FormControl fullWidth color="success">
        <InputLabel id="demo-simple-select-label">Adyn:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={user}
          label="Adyn"
          onChange={(event) => {
            setUser(event.target.value as string);
          }}
        >
          <MenuItem value={"rahim"}>Rahim</MenuItem>
          <MenuItem value={"intizar"}>Intizar</MenuItem>
          <MenuItem value={"ovadan"}>Ovadan</MenuItem>
          <MenuItem value={"jennet"}>Jennet</MenuItem>
          <MenuItem value={"hudayar"}>Hudayar</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
}
