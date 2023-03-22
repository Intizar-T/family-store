import { Grid, TextField, Button } from "@mui/material";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { Products } from "./ProductList";

interface CreateProductProps {
  newProduct: string;
  setNewProduct: (newProduct: string) => void;
  newProductAmount: string;
  setNewProductAmount: (newProductAmount: string) => void;
  setLoading: (loading: boolean) => void;
  user: string;
  setProducts: (products: Products[]) => void;
  fetchProductList: () => Promise<Products[]>;
}

export default function CreateProduct({
  newProduct,
  newProductAmount,
  setLoading,
  setNewProduct,
  setNewProductAmount,
  setProducts,
  user,
  fetchProductList,
}: CreateProductProps) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        bottom: 4,
      }}
    >
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
            value={newProduct}
            focused
            onChange={(e) => {
              setNewProduct(e.target.value);
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
            value={newProductAmount}
            focused
            onChange={(e) => {
              setNewProductAmount(e.target.value);
            }}
            sx={{
              margin: 1,
              width: "100%",
            }}
          />
        </Grid>
      </Grid>
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
                amount:
                  newProductAmount !== ""
                    ? Number(newProductAmount)
                    : undefined,
                createdUserName: user,
              }),
            });
            setNewProduct("");
            setNewProductAmount("");
            setProducts((await Promise.all([fetchProductList()]))[0]);
            setLoading(false);
          }
        }}
        sx={{
          margin: 1,
          marginTop: 0,
        }}
      >
        Dobaw
      </Button>
    </Grid>
  );
}
