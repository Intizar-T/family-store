import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import { Products } from "./ProductList";

interface EditProductProps {
  showEditModal: (show: boolean) => void;
  editedProductName: string;
  setEditedProductName: (name: string) => void;
  editedProductAmount: string;
  setEditedProductAmount: (amount: string) => void;
  selectedProductId: number;
  setProducts: (products: Products[]) => void;
  fetchProductList: () => Promise<Products[]>;
}

export default function EditProduct({
  editedProductAmount,
  editedProductName,
  setEditedProductName,
  setEditedProductAmount,
  showEditModal,
  selectedProductId,
  setProducts,
  fetchProductList,
}: EditProductProps) {
  const [Loading, toggle] = useLoading();
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
            toggle(true);
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
            toggle(false);
            showEditModal(false);
          }}
        >
          OK
        </Button>
      </DialogActions>
      <Loading />
    </Dialog>
  );
}
