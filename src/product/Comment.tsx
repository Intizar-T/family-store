import { Drawer, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { withTranslation } from "react-i18next";
import CommentContext from "./CommentContext";

function Comment() {
  const { setOpenCommentDialog } = useContext(CommentContext);
  return (
    <Grid>
      <Drawer
        anchor="bottom"
        open={true}
        onClose={() => {
          setOpenCommentDialog(false);
        }}
      >
        <Typography>testing comment</Typography>
      </Drawer>
    </Grid>
  );
}

export default withTranslation()(Comment);
