import {
  Avatar,
  Box,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { withTranslation } from "react-i18next";
import CommentContext from "./CommentContext";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserContext from "../context/UserContext";

function Comment() {
  const { comments, setOpenCommentDialog } = useContext(CommentContext);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(UserContext);
  return (
    <Grid>
      <Drawer
        anchor="bottom"
        open={true}
        onClose={() => {
          setOpenCommentDialog(false);
        }}
      >
        <Grid sx={{ height: "50vh", position: "relative" }}>
          <Grid
            sx={{
              position: "absolute",
              height: "calc(100% - 56px)",
              width: "100%",
            }}
          >
            {comments == null || comments.length === 0 ? (
              <Grid>Comment yazylmady haly</Grid>
            ) : (
              <Grid>
                <List>
                  {comments.map(({ name, comment, date }) => (
                    <ListItem
                      secondaryAction={
                        user?.name === name && (
                          <React.Fragment>
                            <IconButton color="primary" onClick={() => {}}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton color="error" onClick={() => {}}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </React.Fragment>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AccountBoxIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={comment}
                        secondary={`${name}  |  ${date}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
          <Grid>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (newComment === "") return;
                console.log(newComment);
                setNewComment("");
              }}
            >
              <TextField
                label="Comment yaz"
                fullWidth
                sx={{ position: "absolute", bottom: 0 }}
                onChange={(e) =>
                  setNewComment(
                    (e as React.ChangeEvent<HTMLInputElement>).target.value
                  )
                }
                value={newComment}
              />
            </form>
          </Grid>
        </Grid>
      </Drawer>
    </Grid>
  );
}

export default withTranslation()(Comment);
