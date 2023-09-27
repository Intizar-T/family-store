import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Button,
  Box,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import FetchProductList from "./FetchProductList";
import EditIcon from "@mui/icons-material/Edit";
import { toggle } from "../helpers/useLoading";
import { toggleMessageProps } from "../helpers/useMessage";
import UserContext from "../context/UserContext";
import ProductContext from "./ProductContext";
import ImageIcon from "@mui/icons-material/Image";
import CheckIcon from "@mui/icons-material/Check";
import { Products, buyStatusList } from "./ProductList";
import { WEBSOCKET_MESSAGE } from "../App";
import { ReadyState } from "react-use-websocket";
import WebSocketContext from "../context/WebSocketContext";
import { t } from "i18next";
import CommentContext from "./CommentContext";
import CommentIcon from "@mui/icons-material/Comment";
import { avatarPhotos } from "../helpers/constants";
import BaseDialog from "../helpers/BaseDialog";

interface ToBuyListItemProps {
  product: Products;
  setSelectedProduct: (product: Products) => void;
  showEditModal: (show: boolean) => void;
  toggleMessage: toggleMessageProps;
  toggle: toggle;
}

export default function ToBuyListItem({
  product,
  setSelectedProduct,
  showEditModal,
  toggleMessage,
  toggle,
}: ToBuyListItemProps) {
  const { user } = useContext(UserContext);
  const { setProducts } = useContext(ProductContext);
  const { readyState, sendMessage } = useContext(WebSocketContext);
  const { setOpenCommentDialog, setComments, setProductId, setProductName } =
    useContext(CommentContext);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  return (
    <ListItem
      secondaryAction={
        <React.Fragment>
          <IconButton
            sx={{ m: 0, p: 0, marginRight: "6px" }}
            color="primary"
            onClick={() => {
              setSelectedProduct(product);
              showEditModal(true);
            }}
          >
            <EditIcon fontSize="medium" />
          </IconButton>
          <IconButton
            sx={{ m: 0, p: 0, pl: 1, marginRight: "6px" }}
            color="success"
            onClick={async () => {
              try {
                if (user == null) return;
                toggle(true);
                await fetchWithErrorHandler(`${PRODUCTS_URL}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    id: product.id.toString(),
                    buyStatus: buyStatusList.BOUGHT,
                    boughtUserName: user.name,
                  }),
                });
                if (readyState === ReadyState.OPEN && sendMessage != null) {
                  sendMessage(
                    JSON.stringify({
                      action: "store",
                      message: WEBSOCKET_MESSAGE.update,
                    })
                  );
                }
                setProducts(await FetchProductList());
                toggle(false);
                toggleMessage(
                  true,
                  "success",
                  "produckt 'Alyndy' lista koshyldy"
                );
                setTimeout(() => {
                  toggleMessage(false);
                }, 1000);
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
            <CheckIcon fontSize="medium" />
          </IconButton>
          {/* <IconButton
            onClick={() => {
              setOpenCommentDialog(true);
              setComments(product.comments);
              setProductId(product.id);
            }}
            sx={{ m: 0, p: 0, marginRight: "6px" }}
          >
            <CommentIcon fontSize="small" />
          </IconButton> */}
        </React.Fragment>
      }
      sx={{ width: "100%", paddingY: 1, paddingRight: 8 }}
    >
      <ListItemAvatar
        onClick={() => {
          setOpenProfileDialog(true);
        }}
      >
        <Avatar
          src={avatarPhotos[product.userName.toLowerCase()] || undefined}
        />
      </ListItemAvatar>
      <Button
        sx={{
          m: 0,
          p: 0,
          textTransform: "none",
          textAlign: "left",
          color: "black",
          width: "100%",
        }}
        onClick={() => {
          setOpenCommentDialog(true);
          setComments(product.comments);
          setProductId(product.id);
          setProductName(product.name);
        }}
      >
        {product && (
          <ListItemText
            primary={
              <React.Fragment>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ mr: 0, pr: 0 }}>{product.name}</Typography>
                </Box>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Box display="flex">
                  <Typography color="green" fontSize={15}>
                    {product.amount !== 0 && product.unit != null
                      ? "- " + product.amount + " " + product.unit
                      : ""}
                  </Typography>
                  {product.comments && product.comments.length > 0 && (
                    <IconButton
                      onClick={() => {
                        setOpenCommentDialog(true);
                        setComments(product.comments);
                        setProductId(product.id);
                      }}
                      sx={{ m: 0, p: 0, pl: 1 }}
                      style={{ height: "100%" }}
                      color="error"
                    >
                      <CommentIcon sx={{ fontSize: "14px" }} />
                    </IconButton>
                  )}
                </Box>
              </React.Fragment>
            }
            sx={{ marginRight: 4, overflowWrap: "break-word" }}
          />
        )}
      </Button>
      {openProfileDialog && (
        <BaseDialog
          handleClose={() => setOpenProfileDialog(false)}
          dialogText={product.userName}
          showNavigationButtons={false}
        >
          <img
            alt={product.userName}
            src={avatarPhotos[product.userName.toLowerCase()] || undefined}
            width={250}
          />
        </BaseDialog>
      )}
    </ListItem>
  );
}
