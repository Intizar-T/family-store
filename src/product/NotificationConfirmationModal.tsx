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
import { toggleMessageProps } from "../helpers/useMessage";
import UserContext from "../context/UserContext";
import { t } from "i18next";

interface NotificationConfirmationModalProps {
  showNotificationConfirmationModal: (show: boolean) => void;
  toggleMessage: toggleMessageProps;
}

export default function NotificationConfirmationModal({
  showNotificationConfirmationModal,
  toggleMessage,
}: NotificationConfirmationModalProps) {
  const [store, setStore] = useState<Store>("pyatorychka");
  const { user } = useContext(UserContext);
  return (
    <Dialog
      open={true}
      onClose={() => {
        showNotificationConfirmationModal(false);
      }}
    >
      <DialogTitle>{`${t("goingToWhichStore")}?`}</DialogTitle>
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
                {t("store")}
              </InputLabel>
              <Select
                value={store}
                label={t("store")}
                onChange={(e) => setStore(e.target.value as Store)}
              >
                <MenuItem value={"pyatorychka"}>{t("pyatorychka")}</MenuItem>
                <MenuItem value={"fixPrice"}>{t("fixPrice")}</MenuItem>
                <MenuItem value={"other"}>{t("otherStore")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              onClick={() => {
                showNotificationConfirmationModal(false);
              }}
            >
              {t("return")}
            </Button>
            <Button
              onClick={async () => {
                try {
                  if (user == null) return;
                  showNotificationConfirmationModal(false);
                  const status = await fetchWithErrorHandler(
                    SEND_NOTIFICATION_URL,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        userId: user.id,
                        message: `${user.name} hazyr ${
                          store === "other"
                            ? "bir magazina gitjak bolotran. Kaysy magazindigini bilimman toka"
                            : store +
                              " magazina gitjak bolotran. Garak zat bolsa store yazynlar"
                        }`,
                      }),
                    }
                  );
                  if (status === "400") throw new Error();
                  toggleMessage(
                    true,
                    "success",
                    "Bashgalara uwedomleniya gitdi"
                  );
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1500);
                } catch (e) {
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
    </Dialog>
  );
}
