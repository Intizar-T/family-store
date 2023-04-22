import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Store } from "./ToBuyList";
import { useContext, useState } from "react";
import { SEND_NOTIFICATION_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import UserContext from "../UserContext";

interface NotificationConfirmationModalProps {
  showNotificationConfirmationModal: (show: boolean) => void;
}

export default function NotificationConfirmationModal({
  showNotificationConfirmationModal,
}: NotificationConfirmationModalProps) {
  const [store, setStore] = useState<Store>("pyatorychka");
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const { user } = useContext(UserContext);
  return (
    <Dialog
      open={true}
      onClose={() => {
        showNotificationConfirmationModal(false);
      }}
    >
      <DialogTitle>Kaysy magazina lonk lonk?</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{
            width: "100%",
            height: "100%",
          }}
          display="flex"
          flexDirection="column"
        >
          <Grid
            item
            xs={12}
            sx={{
              paddingY: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Kaysy Magazindan
              </InputLabel>
              <Select
                value={store}
                label="Kaysy Magazindan"
                onChange={(e) => setStore(e.target.value as Store)}
              >
                <MenuItem value={"pyatorychka"}>Pyatorychka</MenuItem>
                <MenuItem value={"fixPrice"}>Fix Price</MenuItem>
                <MenuItem value={"other"}>Bashka</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              onClick={() => {
                showNotificationConfirmationModal(false);
              }}
            >
              Nazad
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (user == null) return;
                  toggle(true);
                  await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
                    method: "POST",
                    body: JSON.stringify({
                      userId: user.id,
                      message: `${user.name} hazyr ${
                        store === "other"
                          ? "bir magazina gitjak bolotran. Kaysy magazindigini bilimman toka"
                          : store +
                            " magazina gitjak bolotran. Garak zat bolsa store yazynlar"
                      }`,
                      name: user.name,
                      store,
                    }),
                  });
                  toggle(false);
                  toggleMessage(
                    true,
                    "success",
                    "Bashgalara uwedomleniya gitdi"
                  );
                  setTimeout(() => {
                    toggleMessage(false);
                    showNotificationConfirmationModal(false);
                  }, 1500);
                } catch (e) {
                  toggle(false);
                  toggleMessage(
                    true,
                    "error",
                    "Bashkalara habar bermakda bir problema chykty"
                  );
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1500);
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
