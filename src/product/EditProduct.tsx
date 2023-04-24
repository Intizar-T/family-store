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
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { PRODUCTS_URL } from "../api/APIs";
import useLoading from "../helpers/useLoading";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { useContext, useState } from "react";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import UserContext from "../UserContext";
import useMessage from "../helpers/useMessage";
import { Products, buyStatusList } from "./ProductList";
import { Store } from "./ToBuyList";

interface EditProductProps {
  showEditModal: (show: boolean) => void;
  product: Products;
  showBuyCheckBox: boolean;
}

export default function EditProduct({
  showEditModal,
  product,
  showBuyCheckBox,
}: EditProductProps) {
  const [Loading, toggle] = useLoading();
  const { user } = useContext(UserContext);
  const [Message, toggleMessage] = useMessage();
  const { setProducts } = useContext(ProductContext);
  const [editedProductName, setEditedProductName] = useState(product.name);
  const [editedProductAmount, setEditedProductAmount] = useState(
    product.amount?.toString() || ""
  );
  const [editedUnit, setEditedUnit] = useState(product.unit || "");
  const [editedStore, setEditedStore] = useState(product.store);
  const [editedToBuy, setEditedToBuy] = useState(product.buyStatus === "buy");
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => {
        showEditModal(false);
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Produtka info-ny uytgat:"}</DialogTitle>
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
              paddingY: 1,
            }}
            item
            xs={12}
          >
            <TextField
              size="small"
              label="Produkt:"
              color="success"
              value={editedProductName}
              focused
              onChange={(e) => {
                setEditedProductName(e.target.value);
              }}
              sx={{
                width: "100%",
              }}
            />
          </Grid>
          <Grid
            container
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
              paddingY: 1,
            }}
            spacing={1}
          >
            <Grid item xs={7}>
              <TextField
                size="small"
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
            <Grid item xs={5}>
              <FormControl size="small" fullWidth>
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
          <Grid
            container
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
              paddingBottom: 1,
            }}
            spacing={1}
          >
            <Grid item xs={showBuyCheckBox ? 7 : 12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Kaysy Magazindan
                </InputLabel>
                <Select
                  value={editedStore}
                  label="Kaysy Magazindan"
                  onChange={(e) => setEditedStore(e.target.value as Store)}
                >
                  <MenuItem value={"pyatorychka"}>Pyatorychka</MenuItem>
                  <MenuItem value={"fixPrice"}>Fix Price</MenuItem>
                  <MenuItem value={"other"}>Bashka</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {showBuyCheckBox && (
              <Grid item xs={5}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={editedToBuy} />}
                    label="Almaly"
                    onChange={(e) => {
                      setEditedToBuy(
                        (e as React.ChangeEvent<HTMLInputElement>).target
                          .checked
                      );
                    }}
                  />
                </FormGroup>
              </Grid>
            )}
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
                  id: product.id.toString(),
                  name: editedProductName,
                  amount: editedProductAmount,
                  unit: editedUnit,
                  editedUserDevice: user?.device,
                  editedUserName: user?.name,
                  store: editedStore,
                  buyStatus: editedToBuy
                    ? buyStatusList.BUY
                    : buyStatusList.BUY_VOTE,
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
