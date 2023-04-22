import { Grid, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import OnDutyContext from "../OnDutyContext";
import { OnDutyUsersType } from "../App";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { USER_URL } from "../api/APIs";
import UserContext from "../UserContext";
import CheckUser from "../login/CheckUser";

enum DutyList {
  INTIZAR = "Intizar",
  OVADAN = "Ovadan",
  JENNET = "Jennet",
  HUDAYAR = "Hudayar",
}

const ON_DUTY_LIST = ["Intizar", "Ovadan", "Jennet", "Hudayar"];

async function updatePersonOnDuty(
  onDutyUsers: OnDutyUsersType[],
  setOnDutyUsers: (users: OnDutyUsersType[]) => void
) {
  const today = new Date();
  const nextDay = new Date(new Date().setDate(today.getDate() + 1));
  const todayISO = new Date().toISOString().split("T")[0];
  const nextDayISO = nextDay.toISOString().split("T")[0];
  let nextPersonOnDuty = "";
  await Promise.all(
    onDutyUsers
      .filter(({ onDuty }) => onDuty !== "No")
      .map(async ({ name, onDuty: onDutyDate, device }) => {
        if (today.toString().split(" ")[0] === "Sat") {
          if (onDutyDate === todayISO) {
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name,
                device,
                onDuty: nextDayISO,
              }),
            });
          }
        } else {
          if (onDutyDate !== todayISO) {
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name,
                device,
                onDuty: "No",
              }),
            });
            const index = ON_DUTY_LIST.indexOf(name);
            nextPersonOnDuty =
              index === ON_DUTY_LIST.length - 1
                ? ON_DUTY_LIST[0]
                : ON_DUTY_LIST[index + 1];
          }
        }
      })
  );
  if (nextPersonOnDuty !== "") {
    onDutyUsers
      .filter(({ name }) => name === nextPersonOnDuty)
      .map(async ({ name, device }) => {
        await fetchWithErrorHandler(USER_URL, {
          method: "PUT",
          body: JSON.stringify({
            name,
            device,
            onDuty: todayISO,
          }),
        });
      });
    await CheckUser(setOnDutyUsers);
  }
}

function getPersonOnDuty(onDutyUsers: OnDutyUsersType[]): string {
  return onDutyUsers
    .filter(({ onDuty }) => onDuty !== "No")
    .map(({ name }) => {
      if (new Date().toString().split(" ")[0] === "Sat") return "Opshi uborka";
      return name;
    })[0];
}

export default function Duty() {
  const { onDutyUsers, setOnDutyUsers } = useContext(OnDutyContext);
  useEffect(() => {
    (async () => {
      await updatePersonOnDuty(onDutyUsers, setOnDutyUsers);
    })();
  }, []);
  return (
    <Grid
      container
      sx={{
        height: "100%",
        width: "100%",
        p: 2,
      }}
    >
      <Typography>
        Bugun nobatchy: <b>{getPersonOnDuty(onDutyUsers)}</b>
      </Typography>
    </Grid>
  );
}
