import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useContext } from "react";
import { USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import UserContext from "../context/UserContext";

interface DeleteAccountProps {
  handleClose: () => void;
}

export default function DeleteAccount({ handleClose }: DeleteAccountProps) {
  const { user, setUser } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  return (
    <Dialog open={true} keepMounted onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Tocno ocurjakmy?</DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button sx={{ width: 30 }} onClick={handleClose}>
          Yok
        </Button>
        <Button
          sx={{ width: 30 }}
          onClick={async () => {
            try {
              if (user == null) return;
              toggle(true);
              await fetchWithErrorHandler(USER_URL, {
                method: "DELETE",
                body: JSON.stringify({
                  name: user.name,
                }),
              });
              toggleMessage(true, "success", "Udalit edildi");
              setUser(null);
              toggle(false);
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
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
