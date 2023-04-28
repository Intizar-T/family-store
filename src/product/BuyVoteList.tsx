/* eslint-disable array-callback-return */
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
import React, { useContext, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import useLoading from "../helpers/useLoading";
import FetchProductList from "./FetchProductList";
import ProductContext from "./ProductContext";
import useMessage from "../helpers/useMessage";
import { Products, buyStatusList } from "./ProductList";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UserContext from "../UserContext";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import EditProduct from "./EditProduct";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";

enum ACTIONS {
  ADD_LIKE = "addLike",
  REMOVE_LIKE = "removeLike",
  ADD_DISLIKE = "addDislike",
  REMOVE_DISLIKE = "removeDislike",
}

const LIKE_LIMIT = 3;
const DISLIKE_LIMIT = 3;

export default function BuyVoteList() {
  const { products, setProducts } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const [editModal, showEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products>();

  return (
    <List
      sx={{
        bgcolor: "background.paper",
      }}
    >
      {products
        .filter(({ buyStatus }) => buyStatus === buyStatusList.BUY_VOTE)
        .map((product) => {
          if (user == null) return;
          const productIsLiked = product.likes.includes(user.id);
          const productIsDisliked = product.dislikes.includes(user.id);
          return (
            <ListItem
              key={product.id}
              secondaryAction={
                <React.Fragment>
                  <IconButton
                    color="primary"
                    onClick={async () => {
                      try {
                        setSelectedProduct(product);
                        showEditModal(true);
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
                          display: "flex",
                          flexDirection: "row",
                        }}
                        color="primary"
                        onClick={async () => {
                          try {
                            if (user == null) return;
                            if (!productIsDisliked) {
                              if (!productIsLiked) {
                                setProducts(
                                  products.map((pr) => {
                                    if (product.id === pr.id)
                                      pr.likes.push(user.id);
                                    return pr;
                                  })
                                );
                                if (product.likes.length >= LIKE_LIMIT) {
                                  toggle(true);
                                  await fetchWithErrorHandler(PRODUCTS_URL, {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      id: product.id.toString(),
                                      buyStatus: buyStatusList.BUY,
                                    }),
                                  });
                                  setProducts(await FetchProductList());
                                  toggle(false);
                                  toggleMessage(
                                    true,
                                    "success",
                                    `Opshi like sany ${LIKE_LIMIT} yetdi we produkt "Almaly" lista otirildi`
                                  );
                                  setTimeout(() => {
                                    toggleMessage(false);
                                  }, 3000);
                                } else {
                                  await fetchWithErrorHandler(PRODUCTS_URL, {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      id: product.id,
                                      userId: user.id,
                                      action: ACTIONS.ADD_LIKE,
                                    }),
                                  });
                                }
                              }

                              if (productIsLiked) {
                                const userIndex = product.likes.indexOf(
                                  user.id
                                );
                                setProducts(
                                  products.map((pr) => {
                                    if (product.id === pr.id) {
                                      const tempArr = pr.likes;
                                      tempArr.splice(
                                        tempArr.indexOf(user.id),
                                        1
                                      );
                                      pr.likes = tempArr;
                                    }
                                    return pr;
                                  })
                                );
                                await fetchWithErrorHandler(PRODUCTS_URL, {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    id: product.id,
                                    userId: user.id,
                                    action: ACTIONS.REMOVE_LIKE,
                                    userIndex,
                                  }),
                                });
                              }
                            }
                          } catch (error) {
                            toggle(false);
                            toggleMessage(true, "error", "Like koyup bolmady");
                            setTimeout(() => {
                              toggleMessage(false);
                            }, 1500);
                          }
                        }}
                      >
                        {product.likes != null &&
                        user != null &&
                        productIsLiked ? (
                          <ThumbUpIcon fontSize="small" sx={{ mr: 1 }} />
                        ) : (
                          <ThumbUpOffAltIcon fontSize="small" sx={{ mr: 1 }} />
                        )}
                        <Typography>{product.likes?.length || 0}</Typography>
                      </IconButton>
                      <div style={{ width: 40 }} />
                      <IconButton
                        sx={{ m: 0, p: 0 }}
                        color="error"
                        onClick={async () => {
                          try {
                            if (!productIsLiked) {
                              if (!productIsDisliked) {
                                setProducts(
                                  products.map((pr) => {
                                    if (product.id === pr.id)
                                      pr.dislikes.push(user.id);
                                    return pr;
                                  })
                                );
                                if (product.dislikes.length >= DISLIKE_LIMIT) {
                                  toggle(true);
                                  await fetch(
                                    `${PRODUCTS_URL}?id=${product.id}`,
                                    {
                                      method: "DELETE",
                                    }
                                  );
                                  setProducts(await FetchProductList());
                                  toggle(false);
                                  toggleMessage(
                                    true,
                                    "success",
                                    `Opshi like sany ${DISLIKE_LIMIT} yetdi we produkt udalit edildi :(`
                                  );
                                  setTimeout(() => {
                                    toggleMessage(false);
                                  }, 3000);
                                } else {
                                  await fetchWithErrorHandler(PRODUCTS_URL, {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      id: product.id,
                                      userId: user.id,
                                      action: ACTIONS.ADD_DISLIKE,
                                    }),
                                  });
                                }
                              }
                              if (productIsDisliked) {
                                const userIndex = product.dislikes.indexOf(
                                  user.id
                                );
                                setProducts(
                                  products.map((pr) => {
                                    if (product.id === pr.id)
                                      pr.dislikes.splice(
                                        pr.dislikes.indexOf(user.id)
                                      );
                                    return pr;
                                  })
                                );
                                await fetchWithErrorHandler(PRODUCTS_URL, {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    id: product.id,
                                    userId: user.id,
                                    action: ACTIONS.REMOVE_DISLIKE,
                                    userIndex,
                                  }),
                                });
                              }
                            }
                          } catch (error) {
                            toggle(false);
                            toggleMessage(
                              true,
                              "error",
                              "Dislike koyup bolmady"
                            );
                            setTimeout(() => {
                              toggleMessage(false);
                            }, 1500);
                          }
                        }}
                      >
                        {product.dislikes != null &&
                        user != null &&
                        productIsDisliked ? (
                          <ThumbDownIcon fontSize="small" sx={{ mr: 1 }} />
                        ) : (
                          <ThumbDownOffAltIcon
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography>{product.dislikes?.length || 0}</Typography>
                      </IconButton>
                    </Grid>
                  </Grid>
                }
                sx={{ marginRight: 4, overflowWrap: "break-word" }}
              />
            </ListItem>
          );
        })}
      {editModal && selectedProduct != null && (
        <EditProduct
          showBuyCheckBox={false}
          product={selectedProduct}
          showEditModal={showEditModal}
        />
      )}
      <Loading />
      <Message />
    </List>
  );
}
