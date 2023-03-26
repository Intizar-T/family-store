import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useContext } from "react";
import { USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import UserContext from "../UserContext";

interface DeleteAccountProps {
  handleClose: () => void;
}

export default function DeleteAccount({ handleClose }: DeleteAccountProps) {
  const { user, setUser } = useContext(UserContext);
  return (
    <Dialog open={true}>
      <DialogTitle>Tocno ocurjakmy?</DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button variant="contained" sx={{ width: 30 }} onClick={handleClose}>
          Yok
        </Button>
        <Button
          variant="contained"
          sx={{ width: 30 }}
          onClick={async () => {
            handleClose();
            const { success }: { success: boolean } =
              await fetchWithErrorHandler(USER_URL, "json", {
                method: "DELETE",
                body: JSON.stringify({
                  device: user?.device,
                  name: user?.name,
                }),
              });
            setUser(null);
          }}
        >
          Owwa
        </Button>
      </DialogContent>
    </Dialog>
  );
}
