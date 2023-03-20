import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PRODUCTS_URL } from "./APIs";
import { fetchWithErrorHandler } from "./helpers/fetchWithErrorHandles";
import ImageIcon from "@mui/icons-material/Image";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdUserName: string;
}

interface ProductListProps {
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

export default function ProductList({ user }: ProductListProps) {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setProducts((await Promise.all([fetchProductList()]))[0]);
      setLoading(false);
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
            setLoading(true);
            await fetchWithErrorHandler(PRODUCTS_URL, "json", {
              method: "post",
              body: JSON.stringify({
                name: newProduct,
                createdUserName: user,
              }),
            });
            setNewProduct("");
            setProducts((await Promise.all([fetchProductList()]))[0]);
            setLoading(false);
          }
        }}
      >
        Dobaw
      </Button>
      {loading && (
        <Grid
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "50%",
          }}
        >
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
}
