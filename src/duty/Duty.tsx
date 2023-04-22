import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import OnDutyContext from "../OnDutyContext";
import { OnDutyUsersType } from "../App";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { USER_URL } from "../api/APIs";
import UserContext from "../UserContext";
import CheckUser from "../login/CheckUser";
import TasksContext from "../TasksContext";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import CheckIcon from "@mui/icons-material/Check";

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

async function getTasks(): Promise<string[]> {
  const {
    tasks: { L },
  }: { tasks: { L: { S: string }[] } } = await fetchWithErrorHandler(
    `${USER_URL}?id=1`
  );
  return L.map(({ S }) => S);
}

export default function Duty() {
  const { onDutyUsers, setOnDutyUsers } = useContext(OnDutyContext);
  const { tasks, setTasks } = useContext(TasksContext);
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [newTask, setNewTask] = useState("");
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
        overflowY: "scroll",
      }}
    >
      <Grid item xs={12}>
        <Typography>
          Bugun nobatchy: <b>{getPersonOnDuty(onDutyUsers)}</b>
        </Typography>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 2,
        }}
      >
        <Grid item xs={3}>
          <Typography>Taza task:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Task:"
            variant="outlined"
            multiline
            value={newTask}
            onChange={(e) => {
              setNewTask(
                (e as React.ChangeEvent<HTMLInputElement>).target.value
              );
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            onClick={async () => {
              try {
                if (user == null || newTask === "") return;
                toggle(true);
                await fetchWithErrorHandler(USER_URL, {
                  method: "PUT",
                  body: JSON.stringify({
                    name: user.name,
                    device: user.device,
                    newTask,
                  }),
                });
                setTasks(await getTasks());
                setNewTask("");
                toggle(false);
                toggleMessage(true, "success", "Udalit edildi");
                setTimeout(() => {
                  toggleMessage(false);
                }, 1000);
              } catch (error) {
                toggle(false);
                toggleMessage(true, "error", "Taza task koshup bilmadim");
                setTimeout(() => {
                  toggleMessage(false);
                }, 1500);
              }
            }}
          >
            <CheckIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{}}>
        <List>
          <ListItem sx={{ p: 0, m: 0 }}>
            <ListItemText>
              <b>Etmali zatlar:</b>
            </ListItemText>
          </ListItem>
          {tasks.map((task, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <React.Fragment>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      try {
                        if (user == null) return;
                        toggle(true);
                        await fetchWithErrorHandler(USER_URL, {
                          method: "PUT",
                          body: JSON.stringify({
                            name: user.name,
                            device: user.device,
                            taskIndex: index,
                          }),
                        });
                        setTasks(await getTasks());
                        toggle(false);
                        toggleMessage(true, "success", "Udalit edildi");
                        setTimeout(() => {
                          toggleMessage(false);
                        }, 1000);
                      } catch (error) {
                        toggle(false);
                        toggleMessage(true, "error", "Udalit edip bilmadim");
                        setTimeout(() => {
                          toggleMessage(false);
                        }, 1500);
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </React.Fragment>
              }
            >
              <ListItemAvatar
                sx={{
                  minWidth: 0,
                  paddingRight: 1,
                  display: "flex",
                  alignContent: "center",
                }}
              >
                <RadioButtonCheckedIcon />
              </ListItemAvatar>
              <ListItemText sx={{ display: "flex", alignContent: "center" }}>
                {task}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Loading />
      <Message />
    </Grid>
  );
}
