import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import useLoading from "../helpers/useLoading";
import FetchProductList from "./FetchProductList";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import ProductContext from "./ProductContext";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import useMessage from "../helpers/useMessage";
import { buyStatusList } from "./ProductList";
import { WEBSOCKET_MESSAGE } from "../App";
import { ReadyState } from "react-use-websocket";
import WebSocketContext from "../context/WebSocketContext";
import { t } from "i18next";
import { avatarPhotos } from "../helpers/constants";
import BaseDialog from "../helpers/BaseDialog";

export default function BoughtList() {
  const { products, setProducts } = useContext(ProductContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const { lastMessage, readyState, sendMessage } = useContext(WebSocketContext);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileDialogContents, setProfileDialogContents] = useState<{
    userName: string;
    imgUrl: string;
  }>();
  return (
    <List
      sx={{
        bgcolor: "background.paper",
      }}
    >
      {products
        .filter(({ buyStatus }) => buyStatus === buyStatusList.BOUGHT)
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
                      await fetchWithErrorHandler(`${PRODUCTS_URL}`, {
                        method: "PUT",
                        body: JSON.stringify({
                          id: product.id.toString(),
                          buyStatus: buyStatusList.BUY,
                          boughtUserName: "",
                        }),
                      });
                      if (
                        readyState === ReadyState.OPEN &&
                        sendMessage != null
                      ) {
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
                        "produkt izina 'Almaly' lista koshyldy"
                      );
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
                  <RotateLeftIcon />
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
                      if (
                        readyState === ReadyState.OPEN &&
                        sendMessage != null
                      ) {
                        sendMessage(
                          JSON.stringify({
                            action: "store",
                            message: WEBSOCKET_MESSAGE.update,
                          })
                        );
                      }
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
            sx={{ width: "100%" }}
          >
            <ListItemAvatar
              onClick={() => {
                setOpenProfileDialog(true);
                setProfileDialogContents({
                  imgUrl: avatarPhotos[product.userName.toLowerCase()],
                  userName: product.userName,
                });
              }}
            >
              <Avatar
                src={avatarPhotos[product.userName.toLowerCase()] || undefined}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${product.name} ${
                product.amount !== 0 && product.unit != null
                  ? "- " + product.amount + " " + product.unit
                  : ""
              }`}
              // secondary={
              //   <React.Fragment>
              //     <Typography fontSize="small">
              //       {t("createdUser")}: {product.userName}
              //     </Typography>
              //     {product.boughtUserName && (
              //       <Typography fontSize="small" color="#2e7d32">
              //         {t("boughtUser")}: {product.boughtUserName}
              //       </Typography>
              //     )}
              //   </React.Fragment>
              // }
              sx={{ marginRight: 4, overflowWrap: "break-word" }}
            />
          </ListItem>
        ))}
      {openProfileDialog && profileDialogContents && (
        <BaseDialog
          handleClose={() => setOpenProfileDialog(false)}
          dialogText={profileDialogContents.userName}
          showNavigationButtons={false}
        >
          <img
            alt={profileDialogContents.userName}
            src={profileDialogContents.imgUrl}
            width={250}
          />
        </BaseDialog>
      )}
      <Loading />
      <Message />
    </List>
  );
}
