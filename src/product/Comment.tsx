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
import { useContext } from "react";
import { withTranslation } from "react-i18next";
import CommentContext from "./CommentContext";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Comment() {
  const { comments, setOpenCommentDialog } = useContext(CommentContext);
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
                        <React.Fragment>
                          <IconButton color="primary" onClick={() => {}}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" onClick={() => {}}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </React.Fragment>
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
            <TextField
              label="Comment yaz"
              fullWidth
              sx={{ position: "absolute", bottom: 0 }}
            />
          </Grid>
        </Grid>
      </Drawer>
    </Grid>
  );
}

export default withTranslation()(Comment);
