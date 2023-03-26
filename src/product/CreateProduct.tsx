import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext, useState } from "react";
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
  showCreateModal: (show: boolean) => void;
  unit: string;
  setUnit: (unit: string) => void;
}

export default function CreateProduct({
  newProduct,
  newProductAmount,
  setNewProduct,
  setNewProductAmount,
  setProducts,
  fetchProductList,
  showCreateModal,
  setUnit,
  unit,
}: CreateProductProps) {
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  return (
    <Dialog open={true}>
      <DialogTitle textAlign="center">Taza produkt kosh:</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
            item
            xs={12}
          >
            <TextField
              label="Taza kosh:"
              value={newProduct}
              color={newProduct === "" ? "error" : "primary"}
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
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="row"
            alignItems="center"
            spacing={2}
          >
            <TextField
              label="Kancha:"
              value={newProductAmount}
              focused
              onChange={(e) => {
                setNewProductAmount(e.target.value);
              }}
              sx={{
                margin: 1,
              }}
            />
            <FormControl fullWidth sx={{ width: 130 }}>
              <InputLabel id="demo-simple-select-label">Olchag</InputLabel>
              <Select
                value={unit}
                label="olchag"
                onChange={(e) => setUnit(e.target.value)}
              >
                <MenuItem value={"ta"}>ta</MenuItem>
                <MenuItem value={"kg"}>kg</MenuItem>
                <MenuItem value={"litr"}>litr</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="space-between"
            sx={{
              marginX: 1,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                showCreateModal(false);
              }}
            >
              Iza
            </Button>
            <Button
              variant="contained"
              color="primary"
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
                  showCreateModal(false);
                }
              }}
              sx={{
                width: 40,
                height: 40,
              }}
            >
              Dobaw
            </Button>
          </Grid>
          <Loading />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
