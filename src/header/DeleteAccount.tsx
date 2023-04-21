import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useContext } from "react";
import { USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import UserContext from "../UserContext";

interface DeleteAccountProps {
  handleClose: () => void;
}

export default function DeleteAccount({ handleClose }: DeleteAccountProps) {
  const { user, setUser } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  return (
    <Dialog open={true} keepMounted onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>
        Koshan hamma produtkalarynam ocadi. Tocno ocurjakmy?
      </DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button sx={{ width: 30 }} onClick={handleClose}>
          Yok
        </Button>
        <Button
          sx={{ width: 30 }}
          onClick={async () => {
            toggle(true);
            const { success }: { success: boolean } =
              await fetchWithErrorHandler(USER_URL, {
                method: "DELETE",
                body: JSON.stringify({
                  device: user?.device,
                  name: user?.name,
                }),
              });
            if (success) {
              toggleMessage(true, "success", "Udalit edildi");
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
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
