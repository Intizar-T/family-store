import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import React from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { Products } from "./ProductList";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

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
  return (
    <List
      sx={{
        width: "100%",
        maxHeight: "500px",
        bgcolor: "background.paper",
        overflow: "auto",
      }}
    >
      {products.map((product) => (
        <ListItem
          key={product.id}
          secondaryAction={
            <React.Fragment>
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
            primary={`${product.name}`}
            secondary={`${product.createdUserName}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
