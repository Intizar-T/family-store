/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { SEND_NOTIFICATION_URL, USER_URL } from "../api/APIs";
import UserContext from "../context/UserContext";
import TasksContext from "../context/TasksContext";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import CheckIcon from "@mui/icons-material/Check";
import OnDutyContext from "../context/OnGeneralDutyContext";
import { OnDutyUsersType } from "../App";
import OnMealDutyContext from "../context/OnMealDutyContext";
import CheckUser from "../login/CheckUser";

const GENERAL_DUTY_LIST = ["Intizar", "Ovadan", "Jennet", "Hudayar"];
const MEAL_DUTY_LIST = ["Intizar", "Ovadan", "Jennet"];

const getTasks = async (): Promise<string[]> => {
  const {
    tasks: { L },
  }: { tasks: { L: { S: string }[] } } = await fetchWithErrorHandler(
    `${USER_URL}?id=1`
  );
  return L.map(({ S }) => S);
};

const getUserOnDuty = (
  onDutyUsers: OnDutyUsersType[],
  todayISO: string
): string => {
  const userOnDuty = onDutyUsers
    .filter(({ onDuty }) => onDuty === todayISO)
    .map(({ name }) => name);
  if (userOnDuty != null && userOnDuty.length > 0) return userOnDuty[0];
  return "";
};

const checkAndUpdateUserOnDuty = async (
  onDutyUsers: OnDutyUsersType[],
  todayISO: string,
  dutyList: "meal" | "general",
  setOnGeneralDutyUsers: (users: OnDutyUsersType[]) => void,
  setOnMealDutyUsers: (users: OnDutyUsersType[]) => void
) => {
  let userNameToBeUpdated = "";
  await Promise.all(
    onDutyUsers
      .filter(({ onDuty }) => onDuty !== "")
      .map(async ({ onDuty, name, device }) => {
        if (onDuty !== todayISO) {
          if (dutyList === "general") {
            const index = GENERAL_DUTY_LIST.indexOf(name);
            userNameToBeUpdated =
              index + 1 === GENERAL_DUTY_LIST.length
                ? GENERAL_DUTY_LIST[0]
                : GENERAL_DUTY_LIST[index + 1];
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                onGeneralDuty: "",
                name,
                device,
              }),
            });
          } else if (dutyList === "meal") {
            const index = MEAL_DUTY_LIST.indexOf(name);
            userNameToBeUpdated =
              index + 1 === MEAL_DUTY_LIST.length
                ? MEAL_DUTY_LIST[0]
                : MEAL_DUTY_LIST[index + 1];
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                onMealDuty: "",
                name,
                device,
              }),
            });
          }
        }
      })
  );
  if (userNameToBeUpdated !== "") {
    await Promise.all(
      onDutyUsers
        .filter(({ name }) => name === userNameToBeUpdated)
        .map(async ({ name, device }) => {
          if (dutyList === "general") {
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name,
                device,
                onGeneralDuty: todayISO,
              }),
            });
          } else if (dutyList === "meal") {
            await fetchWithErrorHandler(USER_URL, {
              method: "PUT",
              body: JSON.stringify({
                name,
                device,
                onMealDuty: todayISO,
              }),
            });
          }
        })
    );
    await CheckUser(
      setOnGeneralDutyUsers,
      undefined,
      undefined,
      setOnMealDutyUsers
    );
  }
};

// const getUserNames = (dutyList: OnDutyUsersType[]) => {
//   return dutyList.map(({ name }) => name);
// };

export default function Duty() {
  const { onGeneralDutyUsers, setOnGeneralDutyUsers } =
    useContext(OnDutyContext);
  const { onMealDutyUsers, setOnMealDutyUsers } = useContext(OnMealDutyContext);
  const { tasks, setTasks } = useContext(TasksContext);
  const { user, setUser } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [newTask, setNewTask] = useState("");
  const [editMode, setEditMode] = useState(false);
  const todayISO = new Date().toISOString().split("T")[0];
  useEffect(() => {
    (async () => {
      // GENERAL_DUTY_LIST = getUserNames(onGeneralDutyUsers);
      // MEAL_DUTY_LIST = getUserNames(onMealDutyUsers);
      await checkAndUpdateUserOnDuty(
        onGeneralDutyUsers,
        todayISO,
        "general",
        setOnGeneralDutyUsers,
        setOnMealDutyUsers
      );
      await checkAndUpdateUserOnDuty(
        onMealDutyUsers,
        todayISO,
        "meal",
        setOnGeneralDutyUsers,
        setOnMealDutyUsers
      );
    })();
  }, []);
  return (
    <Grid
      container
      sx={{
        height: "100%",
        width: "100%",
        p: 1,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>
            Opshi Nobatchy: <b>{getUserOnDuty(onGeneralDutyUsers, todayISO)}</b>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            Nahar Nobatcy: <b>{getUserOnDuty(onMealDutyUsers, todayISO)}</b>
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{}}>
          <List>
            <Grid container>
              <Grid item xs={6}>
                <ListItemText>
                  <b>Etmali zatlar:</b>
                </ListItemText>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Typography>List uytgat:</Typography>
                <Switch
                  checked={editMode}
                  onChange={(e) => {
                    setEditMode(
                      (e as React.ChangeEvent<HTMLInputElement>).target.checked
                    );
                  }}
                />
              </Grid>
              {editMode && (
                <Grid
                  container
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingY: 1,
                  }}
                >
                  <Grid item xs={3}>
                    <Typography>Taza task:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Task:"
                      variant="outlined"
                      size="small"
                      multiline
                      value={newTask}
                      onChange={(e) => {
                        setNewTask(
                          (e as React.ChangeEvent<HTMLInputElement>).target
                            .value
                        );
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      paddingLeft: 2,
                    }}
                  >
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
                          await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
                            method: "POST",
                            body: JSON.stringify({
                              userId: user.id,
                              message: `${user.name} nobatchylyk lista taza ish koshdy: ${newTask}`,
                            }),
                          });
                          setNewTask("");
                          toggle(false);
                          toggleMessage(true, "success", "Taza task koshuldy");
                          setTimeout(() => {
                            toggleMessage(false);
                          }, 1000);
                        } catch (error) {
                          toggle(false);
                          toggleMessage(
                            true,
                            "error",
                            "Taza task koshup bilmadim"
                          );
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
              )}
            </Grid>
            {/* <ListItem sx={{ p: 0, m: 0 }}></ListItem> */}
            {tasks.map((task, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <React.Fragment>
                    {editMode && (
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
                            await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
                              method: "POST",
                              body: JSON.stringify({
                                userId: user.id,
                                message: `${user.name} nobatchylyk listdan shu task ayyrdy: ${task}`,
                              }),
                            });
                            toggle(false);
                            toggleMessage(true, "success", "Udalit edildi");
                            setTimeout(() => {
                              toggleMessage(false);
                            }, 1000);
                          } catch (error) {
                            toggle(false);
                            toggleMessage(
                              true,
                              "error",
                              "Udalit edip bilmadim"
                            );
                            setTimeout(() => {
                              toggleMessage(false);
                            }, 1500);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
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
      </Grid>
      <Loading />
      <Message />
    </Grid>
  );
}
