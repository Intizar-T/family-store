import { Grid, TextField, Button } from "@mui/material";
import { useContext } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import UserContext from "../UserContext";
import { Products } from "./ProductList";

interface CreateProductProps {
  newProduct: string;
  setNewProduct: (newProduct: string) => void;
  newProductAmount: string;
  setNewProductAmount: (newProductAmount: string) => void;
  setProducts: (products: Products[]) => void;
  fetchProductList: () => Promise<Products[]>;
}

export default function CreateProduct({
  newProduct,
  newProductAmount,
  setNewProduct,
  setNewProductAmount,
  setProducts,
  fetchProductList,
}: CreateProductProps) {
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
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
          if (user !== null && newProduct !== "") {
            toggle(true);
            await fetchWithErrorHandler(PRODUCTS_URL, "json", {
              method: "post",
              body: JSON.stringify({
                name: newProduct,
                amount:
                  newProductAmount !== ""
                    ? Number(newProductAmount)
                    : undefined,
                userDevice: user.device,
                userName: user.name,
              }),
            });
            setNewProduct("");
            setNewProductAmount("");
            setProducts((await Promise.all([fetchProductList()]))[0]);
            toggle(false);
          }
        }}
        sx={{
          margin: 1,
          marginTop: 0,
        }}
      >
        Dobaw
      </Button>
      <Loading />
    </Grid>
  );
}
