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
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useContext, useState } from "react";
import { PRODUCTS_URL, SEND_NOTIFICATION_URL, USER_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import useLoading from "../helpers/useLoading";
import UserContext from "../context/UserContext";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import useMessage from "../helpers/useMessage";
import { Store } from "./ToBuyList";
import { Checkbox } from "@mui/material";
import { buyStatusList } from "./ProductList";
import { WEBSOCKET_MESSAGE } from "../App";
import { ReadyState } from "react-use-websocket";
import WebSocketContext from "../context/WebSocketContext";
import { t } from "i18next";

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
  const [store, setStore] = useState<Store>("pyatorychka");
  const [toBuy, setToBuy] = useState(true);
  const { lastMessage, readyState, sendMessage } = useContext(WebSocketContext);

  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => {
        showCreateModal(false);
      }}
    >
      <DialogTitle textAlign="center">{t("addNewProduct")}:</DialogTitle>
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
              label={`${t("productLabel")}:`}
              value={newProduct}
              focused
              onChange={(e) => {
                setNewProduct(e.target.value);
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
                label={`${t("amount")}:`}
                value={newProductAmount}
                focused
                onChange={(e) => {
                  setNewProductAmount(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {t("unit")}
                </InputLabel>
                <Select
                  value={unit}
                  label={`${t("unit")}:`}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <MenuItem value={"ta"}>{t("pieces")}</MenuItem>
                  <MenuItem value={"kg"}>{t("kg")}</MenuItem>
                  <MenuItem value={"litr"}>{t("litr")}</MenuItem>
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
              paddingY: 1,
            }}
            spacing={1}
          >
            <Grid item xs={7}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {t("store")}
                </InputLabel>
                <Select
                  value={store}
                  label={`${t("store")}:`}
                  onChange={(e) => setStore(e.target.value as Store)}
                >
                  <MenuItem value={"pyatorychka"}>{t("pyatorychka")}</MenuItem>
                  <MenuItem value={"fixPrice"}>{t("fixPrice")}</MenuItem>
                  <MenuItem value={"other"}>{t("otherStore")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={toBuy} />}
                  label={t("toBuy")}
                  onChange={(e) => {
                    setToBuy(
                      (e as React.ChangeEvent<HTMLInputElement>).target.checked
                    );
                  }}
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="space-between">
            <Button
              onClick={() => {
                showCreateModal(false);
              }}
            >
              {t("return")}
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
                        store,
                        buyStatus: toBuy
                          ? buyStatusList.BUY
                          : buyStatusList.BUY_VOTE,
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

                    if (readyState === ReadyState.OPEN && sendMessage != null) {
                      sendMessage(
                        JSON.stringify({
                          action: "store",
                          message: WEBSOCKET_MESSAGE.update,
                        })
                      );
                    }

                    try {
                      await fetchWithErrorHandler("SEND_NOTIFICATION_URL", {
                        method: "POST",
                        body: JSON.stringify({
                          userId: user.id,
                          message: `${user.name} ${
                            toBuy ? "Almaly" : "Almalymy"
                          } lista "${newProduct}" koshdy. ${
                            toBuy
                              ? ""
                              : "Girip golosawat etmagi yatdan chykarman pwease"
                          }`,
                        }),
                      });
                    } catch (e) {}

                    // clean up and fetch new product list
                    setNewProduct("");
                    setNewProductAmount("");
                    setUnit("");

                    setProducts(await FetchProductList());

                    toggle(false);
                    toggleMessage(true, "success", "taza produkt koshuldy");
                    setTimeout(() => {
                      toggleMessage(false);
                      showCreateModal(false);
                    }, 1500);
                  } catch (e) {
                    // clean up and fetch new product list
                    setNewProduct("");
                    setNewProductAmount("");
                    setUnit("");

                    setProducts(await FetchProductList());

                    toggle(false);
                    toggleMessage(
                      true,
                      "error",
                      "Ya producty koshup bilmadim ya bashgalara habar ibarip bilmadim :("
                    );
                    setTimeout(() => {
                      toggleMessage(false);
                      showCreateModal(false);
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
