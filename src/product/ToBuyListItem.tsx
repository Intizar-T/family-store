import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
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
  return (
    <ListItem
      secondaryAction={
        <React.Fragment>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedProduct(product);
              showEditModal(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ mr: 1 }}
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
                    boughtUserDevice: user.device,
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
            <CheckIcon />
          </IconButton>
        </React.Fragment>
      }
      sx={{ width: "100%", paddingY: 1, paddingRight: 8 }}
    >
      <ListItemAvatar>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      {product && (
        <ListItemText
          primary={`${product.name} ${
            product.amount !== 0 && product.unit != null
              ? "- " + product.amount + " " + product.unit
              : ""
          }`}
          secondary={
            <React.Fragment>
              <Typography fontSize="small">
                {t("createdUser")}: {product.userName}
              </Typography>
              {product.editedUserName && (
                <Typography fontSize="small" color="#1976D2">
                  {t("updatedUser")}: {product.editedUserName}
                </Typography>
              )}
            </React.Fragment>
          }
          sx={{ marginRight: 4, overflowWrap: "break-word" }}
        />
      )}
    </ListItem>
  );
}
