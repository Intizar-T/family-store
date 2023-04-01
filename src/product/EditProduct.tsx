import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { PRODUCTS_URL } from "../api/APIs";
import useLoading from "../helpers/useLoading";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { useContext } from "react";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import UserContext from "../UserContext";
import useMessage from "../helpers/useMessage";

interface EditProductProps {
  showEditModal: (show: boolean) => void;
  editedProductName: string;
  setEditedProductName: (name: string) => void;
  editedProductAmount: string;
  setEditedProductAmount: (amount: string) => void;
  selectedProductId: number;
  editedUnit: string;
  setEditedUnit: (unit: string) => void;
}

export default function EditProduct({
  editedProductAmount,
  editedProductName,
  setEditedProductName,
  setEditedProductAmount,
  showEditModal,
  selectedProductId,
  setEditedUnit,
  editedUnit,
}: EditProductProps) {
  const [Loading, toggle] = useLoading();
  const { setProducts } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const [Message, toggleMessage] = useMessage();
  return (
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
          container
          spacing={1}
        >
          <Grid item xs={12}>
            <TextField
              label="Taza kosh:"
              color="success"
              value={editedProductName}
              focused
              onChange={(e) => {
                setEditedProductName(e.target.value);
              }}
              sx={{
                marginY: 1,
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
                marginY: 1,
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Olchag</InputLabel>
              <Select
                value={editedUnit}
                label="olchag"
                onChange={(e) => setEditedUnit(e.target.value)}
              >
                <MenuItem value={"ta"}>ta</MenuItem>
                <MenuItem value={"kg"}>kg</MenuItem>
                <MenuItem value={"litr"}>litr</MenuItem>
              </Select>
            </FormControl>
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
            try {
              toggle(true);
              await fetchWithErrorHandler(PRODUCTS_URL, {
                method: "PUT",
                body: JSON.stringify({
                  id: selectedProductId.toString(),
                  name: editedProductName,
                  amount: editedProductAmount,
                  unit: editedUnit,
                  editedUserDevice: user?.device,
                  editedUserName: user?.name,
                }),
              });
              setProducts(await FetchProductList());
              toggleMessage(true, "success", "produkt uytgadildi");
              toggle(false);
              setTimeout(() => {
                toggleMessage(false);
                showEditModal(false);
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
          }}
        >
          OK
        </Button>
      </DialogActions>
      <Loading />
      <Message />
    </Dialog>
  );
}
