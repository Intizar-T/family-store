import {
  Avatar,
  Box,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { withTranslation } from "react-i18next";
import CommentContext from "./CommentContext";
import ImageIcon from "@mui/icons-material/Image";

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
                  {comments.map(({ user, comment }) => (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <ImageIcon />
                        </Avatar>
                      </ListItemAvatar>
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
