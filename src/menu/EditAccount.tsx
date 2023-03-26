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
                if (user == null) return;
                toggle(true);
                const { success }: { success: boolean } =
                  await fetchWithErrorHandler(
                    `${USER_URL}/${user.name}`,
                    "json",
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        newName: editedUserName,
                        device: user.device,
                      }),
                    }
                  );
                if (success) {
                  toggleMessage(true, "success", "Uytgadildi");
                  setUser(null);
                  toggle(false);
                  setTimeout(() => {
                    toggleMessage(false);
                    handleClose();
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
