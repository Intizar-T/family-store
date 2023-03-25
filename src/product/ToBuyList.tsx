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

interface ToBuyListProps {
  products: Products[];
  setProducts: (products: Products[]) => void;
  fetchProductList: () => Promise<Products[]>;
  setLoading: (loading: boolean) => void;
}

export default function ToBuyList({
  products,
  setLoading,
  fetchProductList,
  setProducts,
}: ToBuyListProps) {
  const [editModal, showEditModal] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductAmount, setEditedProductAmount] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(0);

  return (
    <List
      sx={{
        bgcolor: "background.paper",
      }}
      style={{
        maxHeight: "calc(100vh - 250px)",
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
                  showEditModal(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ mr: 1 }}
                color="error"
                onClick={async () => {
                  setLoading(true);
                  await fetch(`${PRODUCTS_URL}/${product.id}`, {
                    method: "delete",
                  });
                  setProducts((await Promise.all([fetchProductList()]))[0]);
                  setLoading(false);
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
              product.amount !== null ? "- " + product.amount + " ta/kg" : ""
            }`}
            secondary={`${product.userName}`}
            sx={{ marginRight: 10, overflowX: "hidden" }}
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
          setLoading={setLoading}
          setProducts={setProducts}
          showEditModal={showEditModal}
        />
      )}
    </List>
  );
}
