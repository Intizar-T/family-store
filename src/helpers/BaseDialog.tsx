import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import { HTMLProps, PropsWithChildren } from "react";

type BaseDialogProps = PropsWithChildren<HTMLProps<HTMLDivElement>> & {
  handleClose: () => void;
  dialogText: string;
  handleConfirm?: () => Promise<void> | void;
  successMessage?: string;
  errorMessage?: string;
  cancelText?: string;
  confirmText?: string;
  modalKeepAliveTime?: number;
  showNavigationButtons?: boolean;
};

export default function BaseDialog({
  children,
  handleClose,
  handleConfirm,
  dialogText,
  errorMessage,
  successMessage,
  cancelText,
  confirmText,
  modalKeepAliveTime,
  showNavigationButtons = true,
}: BaseDialogProps) {
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  return (
    <Dialog open={true} keepMounted onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogText}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Box>{children}</Box>
        {showNavigationButtons && (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button sx={{ width: 30 }} onClick={handleClose}>
              {cancelText || "Nazad"}
            </Button>
            <Button
              sx={{ width: 30 }}
              onClick={async () => {
                if (handleConfirm == null) return;
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
                  toggleMessage(
                    true,
                    "error",
                    errorMessage || "Bolmady chota :("
                  );
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1000);
                }
              }}
            >
              {confirmText || "OK"}
            </Button>
          </Box>
        )}
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
