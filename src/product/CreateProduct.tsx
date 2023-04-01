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
import { PRODUCTS_URL, USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import UserContext from "../UserContext";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import useMessage from "../helpers/useMessage";

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
  const { setProducts } = useContext(ProductContext);
  const [Message, toggleMessage] = useMessage();
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
                  const id = new Date().getTime();
                  try {
                    toggle(true);
                    await fetchWithErrorHandler(PRODUCTS_URL, {
                      method: "POST",
                      body: JSON.stringify({
                        id,
                        name: newProduct,
                        amount: newProductAmount,
                        unit,
                        createdUserDevice: user.device,
                        createdUserName: user.name,
                      }),
                    });
                    await fetchWithErrorHandler(USER_URL, {
                      method: "PUT",
                      body: JSON.stringify({
                        device: user.device,
                        name: user.name,
                        newProductId: id,
                      }),
                    });
                    setProducts(await FetchProductList());
                    toggleMessage(true, "success", "taza produkt koshuldy");
                    setNewProduct("");
                    setNewProductAmount("");
                    setUnit("");
                    toggle(false);
                    setTimeout(() => {
                      toggleMessage(false);
                      showCreateModal(false);
                    }, 1500);
                  } catch (e) {
                    toggle(false);
                    toggleMessage(
                      true,
                      "error",
                      "Chota birzat yalnys gitdi. Please, Intizar bilan habarlashyn."
                    );
                    setTimeout(() => {
                      toggleMessage(false);
                    }, 1500);
                  }
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
        </Grid>
      </DialogContent>
      <Loading />
      <Message />
    </Dialog>
  );
}
