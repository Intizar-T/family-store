import { Button } from "@mui/material";

export default function BoughtPanelFooter() {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: 60,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Button
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#d32f2f",
          color: "white",
        }}
        onClick={async () => {}}
      >
        Hammasini Ochur
      </Button>
    </div>
  );
}
