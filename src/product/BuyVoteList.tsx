import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Grid,
} from "@mui/material";
import React, { useContext } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import useLoading from "../helpers/useLoading";
import FetchProductList from "./FetchProductList";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import ProductContext from "./ProductContext";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import useMessage from "../helpers/useMessage";
import { Products, buyStatusList } from "./ProductList";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UserContext from "../UserContext";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";

const dummyProduct = {
  id: 10000,
  name: "agursy",
  buyStatus: "buyVote",
  createdAt: new Date(),
  updatedAt: new Date(),
  userDevice: "device",
  userName: "Intizar",
  store: "fixPrice",
  likes: ["1681669345"],
  dislikes: ["1681669345"],
  amount: 0,
  unit: "ta",
} as Products;

export default function BuyVoteList() {
  const { products, setProducts } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();

  return (
    <List
      sx={{
        bgcolor: "background.paper",
      }}
    >
      {[...products, dummyProduct]
        .filter(({ buyStatus }) => buyStatus === buyStatusList.BUY_VOTE)
        .map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <React.Fragment>
                <IconButton
                  color="primary"
                  onClick={async () => {
                    try {
                      toggle(true);
                      // await fetchWithErrorHandler(`${PRODUCTS_URL}`, {
                      //   method: "PUT",
                      //   body: JSON.stringify({
                      //     id: product.id.toString(),
                      //     buyStatus: buyStatusList.BUY,
                      //     boughtUserDevice: "",
                      //     boughtUserName: "",
                      //   }),
                      // });
                      // setProducts(await FetchProductList());
                      toggle(false);
                      toggleMessage(true, "success", "poka ishlamidi");
                      setTimeout(() => {
                        toggleMessage(false);
                      }, 1500);
                    } catch (e) {
                      toggle(false);
                      toggleMessage(
                        true,
                        "error",
                        "Chota birzat yalnys gitdi. Please, Intizar bilan habarlashyn."
                      );
                      setTimeout(() => {
                        toggleMessage(false);
                      }, 1500);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ mr: 1 }}
                  color="error"
                  onClick={async () => {
                    try {
                      toggle(true);
                      await fetch(`${PRODUCTS_URL}?id=${product.id}`, {
                        method: "DELETE",
                      });
                      setProducts(await FetchProductList());
                      toggle(false);
                      toggleMessage(true, "success", "produkt udalit edildi");
                      setTimeout(() => {
                        toggleMessage(false);
                      }, 1500);
                    } catch (e) {
                      toggle(false);
                      toggleMessage(
                        true,
                        "error",
                        "Chota birzat yalnys gitdi. Please, Intizar bilan habarlashyn."
                      );
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
            sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}
          >
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${product.name} ${
                product.amount !== 0 && product.unit != null
                  ? "- " + product.amount + " " + product.unit
                  : ""
              }`}
              secondary={
                <Grid
                  container
                  sx={{
                    width: "100%",
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <Grid item xs={12}>
                    <Typography fontSize="small" sx={{ m: 0, p: 0 }}>
                      Doratdi: {product.userName}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <IconButton
                      sx={{
                        m: 0,
                        p: 0,
                        mr: 3,
                        display: "flex",
                        flexDirection: "row",
                      }}
                      color="primary"
                      onClick={() => {
                        toggleMessage(true, "success", "poka ishlamidi");
                        setTimeout(() => {
                          toggleMessage(false);
                        }, 1500);
                      }}
                    >
                      {product.likes != null &&
                      user != null &&
                      product.likes.includes(user.id) ? (
                        <ThumbUpIcon fontSize="small" sx={{ mr: 1 }} />
                      ) : (
                        <ThumbUpOffAltIcon fontSize="small" sx={{ mr: 1 }} />
                      )}
                      <Typography>{product.likes?.length || 0}</Typography>
                    </IconButton>
                    <IconButton
                      sx={{ m: 0, p: 0 }}
                      color="error"
                      onClick={() => {
                        toggleMessage(true, "success", "poka ishlamidi");
                        setTimeout(() => {
                          toggleMessage(false);
                        }, 1500);
                      }}
                    >
                      {product.dislikes != null &&
                      user != null &&
                      product.dislikes.includes(user.id) ? (
                        <ThumbDownIcon fontSize="small" sx={{ mr: 1 }} />
                      ) : (
                        <ThumbDownOffAltIcon fontSize="small" sx={{ mr: 1 }} />
                      )}
                      <Typography>{product.dislikes?.length || 0}</Typography>
                    </IconButton>
                  </Grid>
                </Grid>
              }
              sx={{ marginRight: 4, overflowWrap: "break-word" }}
            />
          </ListItem>
        ))}
      <Loading />
      <Message />
    </List>
  );
}
