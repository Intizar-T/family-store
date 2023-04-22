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
import UserContext from "../UserContext";
import ProductContext from "./ProductContext";
import ImageIcon from "@mui/icons-material/Image";
import CheckIcon from "@mui/icons-material/Check";
import { Products, buyStatusList } from "./ProductList";

interface ToBuyListItemProps {
  product: Products;
  setSelectedProduct: (product: Products) => void;
  setSelectedProductId: (productId: number) => void;
  showEditModal: (show: boolean) => void;
  toggleMessage: toggleMessageProps;
  toggle: toggle;
}

export default function ToBuyListItem({
  product,
  setSelectedProductId,
  setSelectedProduct,
  showEditModal,
  toggleMessage,
  toggle,
}: ToBuyListItemProps) {
  const { user } = useContext(UserContext);
  const { setProducts } = useContext(ProductContext);
  return (
    <ListItem
      secondaryAction={
        <React.Fragment>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedProduct(product);
              setSelectedProductId(product.id);
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
                Doratdi: {product.userName}
              </Typography>
              {product.editedUserName && (
                <Typography fontSize="small" color="#1976D2">
                  Uytgatdi: {product.editedUserName}
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
