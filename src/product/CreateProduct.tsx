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
import { useContext } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import UserContext from "../UserContext";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";

interface CreateProductProps {
  newProduct: string;
  setNewProduct: (newProduct: string) => void;
  newProductAmount: string;
  setNewProductAmount: (newProductAmount: string) => void;
  showCreateModal: (show: boolean) => void;
  unit: string;
  setUnit: (unit: string) => void;
}

export default function CreateProduct({
  newProduct,
  newProductAmount,
  setNewProduct,
  setNewProductAmount,
  showCreateModal,
  setUnit,
  unit,
}: CreateProductProps) {
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const { products, setProducts } = useContext(ProductContext);
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => {
        showCreateModal(false);
      }}
    >
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
              label="Product:"
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
              onClick={() => {
                showCreateModal(false);
              }}
            >
              Nazad
            </Button>
            <Button
              onClick={async () => {
                if (user !== null && newProduct !== "") {
                  toggle(true);
                  await fetchWithErrorHandler(PRODUCTS_URL, "json", {
                    method: "POST",
                    body: JSON.stringify({
                      name: newProduct,
                      amount: newProductAmount,
                      unit,
                      createdUserDevice: user.device,
                      createdUserName: user.name,
                    }),
                  });
                  setNewProduct("");
                  setNewProductAmount("");
                  setUnit("");
                  setProducts(await FetchProductList());
                  toggle(false);
                  showCreateModal(false);
                }
              }}
              sx={{
                width: 40,
                height: 40,
              }}
            >
              OK
            </Button>
          </Grid>
          <Loading />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
