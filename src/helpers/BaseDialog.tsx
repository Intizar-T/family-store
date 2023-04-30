import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";

interface BaseDialogProps {
  handleClose: () => void;
  handleConfirm: () => Promise<void>;
  dialogText: string;
  successMessage?: string;
  errorMessage?: string;
  cancelText?: string;
  confirmText?: string;
  modalKeepAliveTime?: number;
}

export default function BaseDialog({
  handleClose,
  handleConfirm,
  dialogText,
  errorMessage,
  successMessage,
  cancelText,
  confirmText,
  modalKeepAliveTime,
}: BaseDialogProps) {
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  return (
    <Dialog open={true} keepMounted onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogText}</DialogTitle>
      <DialogContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button sx={{ width: 30 }} onClick={handleClose}>
          {cancelText || "Nazad"}
        </Button>
        <Button
          sx={{ width: 30 }}
          onClick={async () => {
            try {
              toggle(true);
              await handleConfirm();
              toggle(false);
              toggleMessage(true, "success", successMessage || "Boldy!");
              setTimeout(() => {
                toggleMessage(false);
                handleClose();
              }, modalKeepAliveTime || 1000);
            } catch (error) {
              toggle(false);
              toggleMessage(true, "error", errorMessage || "Bolmady chota :(");
              setTimeout(() => {
                toggleMessage(false);
              }, 1000);
            }
          }}
        >
          {confirmText || "OK"}
        </Button>
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
