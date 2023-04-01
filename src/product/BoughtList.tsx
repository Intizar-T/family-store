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
import EditProduct from "./EditProduct";
import useLoading from "../helpers/useLoading";
import FetchProductList from "./FetchProductList";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import ProductContext from "./ProductContext";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import useMessage from "../helpers/useMessage";

export default function BoughtList() {
  const [editModal, showEditModal] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductAmount, setEditedProductAmount] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [Loading, toggle] = useLoading();
  const { products, setProducts } = useContext(ProductContext);
  const [Message, toggleMessage] = useMessage();

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        overflowY: "scroll",
      }}
      style={{
        maxHeight: "calc(100vh - 230px)",
      }}
    >
      {products
        .filter(({ isBought }) => isBought)
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
                          isBought: "false",
                          boughtUserDevice: "",
                          boughtUserName: "",
                        }),
                      });
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
                <React.Fragment>
                  <Typography fontSize="small" color="red">
                    Doratdi: {product.userName}
                  </Typography>
                  {/* {product.editedUserName && (
                    <Typography fontSize="small" color="#1976D2">
                      Uytgatdi: {product.editedUserName}
                    </Typography>
                  )} */}
                  {product.boughtUserName && (
                    <Typography fontSize="small" color="#2e7d32">
                      Satyn aldy: {product.boughtUserName}
                    </Typography>
                  )}
                </React.Fragment>
              }
              sx={{ marginRight: 4, overflowWrap: "break-word" }}
            />
          </ListItem>
        ))}
      {editModal && (
        <EditProduct
          editedProductAmount={editedProductAmount}
          editedProductName={editedProductName}
          selectedProductId={selectedProductId}
          setEditedProductAmount={setEditedProductAmount}
          setEditedProductName={setEditedProductName}
          showEditModal={showEditModal}
          editedUnit={editedUnit}
          setEditedUnit={setEditedUnit}
        />
      )}
      <Loading />
      <Message />
    </List>
  );
}
