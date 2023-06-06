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
import UserContext from "../context/UserContext";
import CheckUser from "./CheckUser";
import OnGeneralDutyContext from "../context/OnGeneralDutyContext";
import OnMealDutyContext from "../context/OnMealDutyContext";
import TasksContext from "../context/TasksContext";

interface LoginProps {
  showLoginModal: (show: boolean) => void;
}

export default function Login({ showLoginModal }: LoginProps) {
  const { setUser } = useContext(UserContext);
  const { setOnGeneralDutyUsers } = useContext(OnGeneralDutyContext);
  const { setOnMealDutyUsers } = useContext(OnMealDutyContext);
  const { setTasks } = useContext(TasksContext);
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
                const userId = new Date().getTime().toString();
                localStorage.setItem("userId", userId);
                if (name === "" || userId == null) return;
                toggle(true);
                localStorage.setItem("name", name);
                await fetchWithErrorHandler(USER_URL, {
                  method: "POST",
                  body: JSON.stringify({
                    id: userId,
                    name,
                  }),
                });
                await CheckUser(
                  setUser,
                  setOnGeneralDutyUsers,
                  setTasks,
                  setOnMealDutyUsers
                );
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
