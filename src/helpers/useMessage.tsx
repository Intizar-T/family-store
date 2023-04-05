import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { FC, useState } from "react";
import { createPortal } from "react-dom";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

type iconColor = "success" | "error";
export type toggleMessageProps = (
  state: boolean,
  iconColor?: iconColor | undefined,
  message?: string
) => void;

export default function useMessage(): [FC, toggleMessageProps] {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [iconColor, setIconColor] = useState<iconColor>();
  const el = document.getElementById("modal");
  const toggleMessage = (
    state: boolean,
    iconColor?: iconColor | undefined,
    message = ""
  ) => {
    setShowMessage(state);
    setMessage(message);
    setIconColor(iconColor);
  };
  return [
    () =>
      showMessage
        ? createPortal(
            <Dialog open={true} sx={{ padding: 2 }}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CheckCircleOutlinedIcon
                  fontSize="large"
                  color={iconColor}
                  sx={{ paddingBottom: 1 }}
                />
                <Typography>{message}</Typography>
              </DialogContent>
            </Dialog>,
            el as HTMLElement
          )
        : null,
    toggleMessage,
  ];
}
