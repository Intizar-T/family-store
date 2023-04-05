import { Backdrop, CircularProgress } from "@mui/material";
import { FC, useState } from "react";
import { createPortal } from "react-dom";

export type toggle = (state: boolean) => void;

export default function useLoading(): [FC, toggle] {
  const [loading, setLoading] = useState(false);
  const el = document.getElementById("modal");
  const toggle = (state: boolean) => {
    setLoading(state);
  };
  return [
    () =>
      loading
        ? createPortal(
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1000,
              }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>,
            el as HTMLElement
          )
        : null,
    toggle,
  ];
}
