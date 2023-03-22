import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import React, { useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { Products } from "./ProductList";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { TransitionProps } from "@mui/material/transitions";

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
        width: "100%",
        bgcolor: "background.paper",
        overflow: "auto",
        marginTop: 7,
      }}
      style={{
        height: "calc(100vh - 210px)",
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
            secondary={`${product.createdUserName}`}
          />
        </ListItem>
      ))}
      {editModal && (
        <Dialog
          open={true}
          // TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            showEditModal(false);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Produtka info-ny uytgat:"}</DialogTitle>
          <DialogContent>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                paddingRight: 2,
              }}
              container
              spacing={1}
            >
              <Grid item xs={6}>
                <TextField
                  label="Taza kosh:"
                  color="success"
                  value={editedProductName}
                  focused
                  onChange={(e) => {
                    setEditedProductName(e.target.value);
                  }}
                  sx={{
                    margin: 1,
                    width: "100%",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Kancha (sany ya kg):"
                  color="success"
                  value={editedProductAmount}
                  focused
                  onChange={(e) => {
                    setEditedProductAmount(e.target.value);
                  }}
                  sx={{
                    margin: 1,
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                showEditModal(false);
              }}
            >
              Nazad
            </Button>
            <Button
              onClick={async () => {
                setLoading(true);
                await fetchWithErrorHandler(
                  `${PRODUCTS_URL}/${selectedProductId}`,
                  "json",
                  {
                    method: "PUT",
                    body: JSON.stringify({
                      name: editedProductName,
                      amount:
                        editedProductAmount !== ""
                          ? Number(editedProductAmount)
                          : undefined,
                    }),
                  }
                );
                setProducts((await Promise.all([fetchProductList()]))[0]);
                setLoading(false);
                showEditModal(false);
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </List>
  );
}
