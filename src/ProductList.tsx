import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PRODUCTS_URL } from "./APIs";
import { fetchWithErrorHandler } from "./helpers/fetchWithErrorHandles";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdUserName: string;
}

interface ProductList {
  user: string;
}

const fetchProductList = async () => {
  const products: Products[] = await fetchWithErrorHandler(
    PRODUCTS_URL,
    "json",
    {
      method: "GET",
    }
  );
  return products;
};

export default function ProductList({ user }: ProductList) {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [updateList, setUpdateList] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setProducts((await Promise.all([fetchProductList()]))[0]);
    })();
  }, []);
  return (
    <Grid
      container
      flexDirection="column"
      sx={{
        padding: 2,
      }}
    >
      <Typography variant="h5">Almaly zatlar:</Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          maxHeight: "500px",
          bgcolor: "background.paper",
          overflow: "auto",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        {products.map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <React.Fragment>
                <IconButton
                  sx={{ mr: 1 }}
                  color="success"
                  onClick={async () => {
                    await fetch(`${PRODUCTS_URL}/${product.id}`, {
                      method: "delete",
                    });
                    setProducts((await Promise.all([fetchProductList()]))[0]);
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </React.Fragment>
            }
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

      <TextField
        label="Taza kosh:"
        color="success"
        value={newProduct}
        focused
        onChange={(e) => {
          setNewProduct(e.target.value);
        }}
        sx={{
          paddingBottom: 2,
        }}
      />
      <Button
        variant="contained"
        color="success"
        onClick={async () => {
          if (user !== "" && newProduct !== "") {
            await fetchWithErrorHandler(PRODUCTS_URL, "json", {
              method: "post",
              body: JSON.stringify({
                name: newProduct,
                createdUserName: user,
              }),
            });
            setNewProduct("");
            setProducts((await Promise.all([fetchProductList()]))[0]);
          }
        }}
      >
        Dobaw
      </Button>
    </Grid>
  );
}
