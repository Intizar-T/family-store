import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import UserContext from "../UserContext";

interface LoginProps {
  device: string;
  showLoginModal: (show: boolean) => void;
}

export default function Login({ device, showLoginModal }: LoginProps) {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [Loading, toggle] = useLoading();
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => {}}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Bir gazaklik registrasiya:"}</DialogTitle>
      <DialogContent>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 2,
          }}
          container
          spacing={1}
        >
          <Grid
            item
            xs={9}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TextField
              label="Adyn pwease:"
              color={name === "" ? "error" : "success"}
              focused
              onChange={(e) => {
                setName(e.target.value);
              }}
              sx={{
                margin: 1,
                width: "100%",
              }}
            />
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: 20,
                height: 40,
              }}
              onClick={async () => {
                if (name === "") return;
                toggle(true);
                setUser({ device, name });
                await fetchWithErrorHandler(USER_URL, {
                  method: "POST",
                  body: JSON.stringify({
                    device,
                    name,
                  }),
                });
                showLoginModal(false);
                toggle(false);
              }}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Loading />
    </Dialog>
  );
}
