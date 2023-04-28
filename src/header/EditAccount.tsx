import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import UserContext from "../UserContext";
import CheckUser from "../login/CheckUser";

interface EditAccountProps {
  handleClose: () => void;
}

export default function EditAccount({ handleClose }: EditAccountProps) {
  const { user, setUser } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [editedUserName, setEditedUserName] = useState(user?.name);
  return (
    <Dialog open={true} keepMounted onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Akkaunt Info:</DialogTitle>
      <DialogContent>
        <Grid container display="flex" flexDirection="column" spacing={2}>
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField
              label="Adyn:"
              color="success"
              value={editedUserName}
              focused
              onChange={(e) => {
                setEditedUserName(e.target.value);
              }}
              sx={{ marginTop: 1 }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button sx={{ width: 30 }} onClick={handleClose}>
              Nazad
            </Button>
            <Button
              sx={{ width: 30 }}
              onClick={async () => {
                try {
                  if (user == null) return;
                  toggle(true);
                  await fetchWithErrorHandler(USER_URL, {
                    method: "PUT",
                    body: JSON.stringify({
                      newName: editedUserName,
                      device: user.device,
                      name: user.name,
                    }),
                  });
                  toggle(false);
                  const updatedUser = await CheckUser(
                    undefined,
                    undefined,
                    user.device
                  );
                  if (updatedUser != null && updatedUser.length > 0)
                    setUser(updatedUser[0]);
                  else throw new Error("Uytgadip bolmady");
                  toggleMessage(true, "success", "Uytgadildi");
                  setTimeout(() => {
                    toggleMessage(false);
                    handleClose();
                  }, 1000);
                } catch (error) {
                  toggle(false);
                  toggleMessage(
                    true,
                    "error",
                    "Uytgadip bolmady. Tazaldan barlan ya Intizar bn habarlashyn"
                  );
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1000);
                }
              }}
            >
              OK
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
