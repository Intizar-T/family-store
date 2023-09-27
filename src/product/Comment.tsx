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
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { PRODUCTS_URL, SEND_NOTIFICATION_URL } from "../api/APIs";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import BaseDialog from "../helpers/BaseDialog";
import TelegramIcon from "@mui/icons-material/Telegram";

function Comment() {
  const {
    comments,
    setOpenCommentDialog,
    productId,
    setProductId,
    setComments,
    setProductName,
    productName,
  } = useContext(CommentContext);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(UserContext);
  const [Message, toggleMessage] = useMessage();
  const { products, setProducts } = useContext(ProductContext);
  return (
    <BaseDialog
      dialogText="Kommentariyalar"
      handleClose={() => {
        setOpenCommentDialog(false);
        setProductId(undefined);
        setComments([]);
        setProductName(undefined);
      }}
      showNavigationButtons={false}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid
          sx={{ width: "100%", mb: 1, maxHeight: "300px", overflowY: "scroll" }}
        >
          <List>
            {comments.map(({ name, comment, date }, index) => (
              <ListItem
                secondaryAction={
                  user?.name === name && (
                    <React.Fragment>
                      {/* <IconButton color="primary" onClick={() => {}}>
                        <EditIcon fontSize="small" />
                      </IconButton> */}
                      <IconButton
                        color="error"
                        onClick={async () => {
                          try {
                            const status = await fetchWithErrorHandler(
                              PRODUCTS_URL,
                              {
                                method: "PUT",
                                body: JSON.stringify({
                                  removeComment: true,
                                  id: productId,
                                  commentIndex: index,
                                }),
                              }
                            );
                            if (status === "400")
                              throw new Error("Comment udalit edip bilmadim");
                            setProducts(await FetchProductList());
                            setComments(
                              comments.filter((cmmnt, idx) => index !== idx)
                            );
                          } catch (error) {
                            const { message } = error as Error;
                            toggleMessage(true, "error", message);
                            setTimeout(() => {
                              toggleMessage(false);
                            }, 1500);
                          }
                        }}
                        sx={{ m: 0, p: 0 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                  )
                }
                sx={{ m: 0, p: 0 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountBoxIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment}
                  secondary={`${name}  |  ${date}`}
                  sx={{ marginRight: 4, overflowWrap: "break-word" }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          xs={12}
        >
          <Grid xs={11}>
            <TextField
              label="Comment yaz"
              fullWidth
              onChange={(e) =>
                setNewComment(
                  (e as React.ChangeEvent<HTMLInputElement>).target.value
                )
              }
              value={newComment}
              sx={{ m: 0, p: 0 }}
            />
          </Grid>
          <Grid
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={async (event) => {
                try {
                  event.preventDefault();
                  if (newComment === "" || user == null) return;
                  const newCommentCopied = newComment;
                  setNewComment("");
                  const today = new Date();
                  const body: any = {
                    name: user.name,
                    comment: newCommentCopied,
                    date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
                  };
                  setComments([...comments, body]);
                  body["id"] = productId;
                  body["addComment"] = true;
                  const updateProductStatus = await fetchWithErrorHandler(
                    PRODUCTS_URL,
                    {
                      method: "PUT",
                      body: JSON.stringify(body),
                    }
                  );
                  if (updateProductStatus === "400")
                    throw new Error("Comment koshup bilmadim :(");
                  setProducts(await FetchProductList());
                  // await fetchWithErrorHandler(SEND_NOTIFICATION_URL, {
                  //   method: "POST",
                  //   body: JSON.stringify({
                  //     userId: user.id,
                  //     message: `${user.name} "${productName?.substring(
                  //       0,
                  //       25
                  //     )}..." produkta kommentariya koshdy: "${newCommentCopied.substring(
                  //       0,
                  //       25
                  //     )}..."`,
                  //   }),
                  // });
                } catch (error) {
                  setNewComment("");
                  setProducts(await FetchProductList());
                  const { message } = error as Error;
                  toggleMessage(true, "error", message);
                  setTimeout(() => {
                    toggleMessage(false);
                  }, 1500);
                }
              }}
              style={{ height: "100%" }}
            >
              <IconButton type="submit" sx={{ m: 0, p: 0, pl: 1 }}>
                <TelegramIcon color="info" fontSize="large" />
              </IconButton>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <Message />
    </BaseDialog>
  );
}

export default withTranslation()(Comment);
