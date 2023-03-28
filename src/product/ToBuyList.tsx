import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { Products } from "./ProductList";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditProduct from "./EditProduct";
import useLoading from "../helpers/useLoading";

interface ToBuyListProps {
  products: Products[];
  setProducts: (products: Products[]) => void;
  fetchProductList: () => Promise<Products[]>;
}

export default function ToBuyList({
  products,
  fetchProductList,
  setProducts,
}: ToBuyListProps) {
  const [editModal, showEditModal] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductAmount, setEditedProductAmount] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [Loading, toggle] = useLoading();
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
      {products.map((product) => (
        <ListItem
          key={product.id}
          secondaryAction={
            <React.Fragment>
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedProductId(product.id);
                  setEditedProductName(product.name);
                  setEditedProductAmount(`${product.amount}`);
                  setEditedUnit(product.unit || "");
                  showEditModal(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ mr: 1 }}
                color="error"
                onClick={async () => {
                  toggle(true);
                  await fetch(`${PRODUCTS_URL}/${product.id}`, {
                    method: "delete",
                  });
                  setProducts((await Promise.all([fetchProductList()]))[0]);
                  toggle(false);
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
              product.amount != null && product.unit != null
                ? "- " + product.amount + " " + product.unit
                : ""
            }`}
            secondary={`${product.userName}`}
            sx={{ marginRight: 4, overflowWrap: "break-word" }}
          />
        </ListItem>
      ))}
      {editModal && (
        <EditProduct
          editedProductAmount={editedProductAmount}
          editedProductName={editedProductName}
          fetchProductList={fetchProductList}
          selectedProductId={selectedProductId}
          setEditedProductAmount={setEditedProductAmount}
          setEditedProductName={setEditedProductName}
          setProducts={setProducts}
          showEditModal={showEditModal}
          editedUnit={editedUnit}
          setEditedUnit={setEditedUnit}
        />
      )}
      <Loading />
    </List>
  );
}
