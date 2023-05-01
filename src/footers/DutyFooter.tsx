import { Button, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";
import OnDutyContext from "../context/OnDutyContext";
import UserContext from "../UserContext";
import { SEND_NOTIFICATION_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";

type OnDutyStatusType = "onDuty" | "reqeustedChange" | "offDuty";

export default function DutyFooter() {
  const { onDutyUsers, setOnDutyUsers } = useContext(OnDutyContext);
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [onDutyStatus, setOnDutyStatus] = useState<OnDutyStatusType>(
    "offDuty"
    // onDutyUsers
    //   .filter(({ name }) => name === user?.name)
    //   .map(({ onDuty }) => {
    //     if (onDuty === "No") return "offDuty";
    //     if (onDuty === "Pending") return "requestedChange";
    //     else return "onDuty";
    //   })[0] as OnDutyStatusType
  );
  const [dutyChangeRequestedUser, setDutyChangeRequestedUser] = useState(
    onDutyUsers
      .filter(({ onDuty }) => onDuty === "Pending")
      .map(({ name }) => name)[0] || "Intizar"
  );
  return (
    <Grid
      container
      style={{
        position: "absolute",
        width: "100%",
        height: 60,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {onDutyStatus === "onDuty" && (
        <Grid
          container
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography>Nobatchylygy almash: </Typography>
          </Grid>
          <Grid
            item
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              //   sx={{
              //     textTransform: "none",
              //   }}
              onClick={async () => {
                try {
                  if (user == null) return;
                  toggle(true);
                  await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
                    method: "POST",
                    body: JSON.stringify({
                      userId: user.id,
                      message: `${user.name} nobatchylygy almashmagy hayys edotran`,
                    }),
                  });
                  setOnDutyStatus("reqeustedChange");
                  toggle(false);
                  toggleMessage(true, "success", "Hayysh edildi");
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1000);
                } catch (error) {
                  toggle(false);
                  toggleMessage(true, "error", "Hayysh edip bolmady");
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1500);
                }
              }}
            >
              sora
            </Button>
          </Grid>
        </Grid>
      )}
      {onDutyStatus === "reqeustedChange" && (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Bashkalardan soradym</Typography>
          <Typography>jogaba karashotrypman...</Typography>
        </Grid>
      )}
      {onDutyStatus === "offDuty" &&
        (dutyChangeRequestedUser === "" ? (
          <Grid>
            <Typography>Sen bugun nobatcy amaz, keypcilik!</Typography>
          </Grid>
        ) : (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>
              <b>{dutyChangeRequestedUser}</b> almashmagy sorady:
            </Typography>
            <Button
              sx={{ textTransform: "none" }}
              onClick={() => {}}
              variant="contained"
            >
              Kabul Et
            </Button>
          </Grid>
        ))}
      <Loading />
      <Message />
    </Grid>
  );
}
