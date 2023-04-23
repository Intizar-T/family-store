import { Typography } from "@mui/material";

export default function BuyVotePanelFooter() {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: 60,
        bottom: 0,
      }}
    >
      <Typography
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        color="error"
      >
        Hali onarylotran...
      </Typography>
    </div>
  );
}
