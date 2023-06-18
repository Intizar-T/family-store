/* eslint-disable react-hooks/exhaustive-deps */
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
import UserContext from "../context/UserContext";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import { toggleMessageProps } from "../helpers/useMessage";
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
  toggleMessage: toggleMessageProps;
}

export default function CreateProduct({
  newProduct,
  newProductAmount,
  setNewProduct,
  setNewProductAmount,
  showCreateModal,
  setUnit,
  unit,
  toggleMessage,
}: CreateProductProps) {
  const { user } = useContext(UserContext);
  const { products, setProducts } = useContext(ProductContext);
  const [store, setStore] = useState<Store>("pyatorychka");
  const [toBuy, setToBuy] = useState(true);
  const { readyState, sendMessage } = useContext(WebSocketContext);

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
                    // clean up and fetch new product list
                    setProducts([
                      ...products,
                      {
                        id: 0,
                        name: newProduct,
                        buyStatus: toBuy
                          ? buyStatusList.BUY
                          : buyStatusList.BUY_VOTE,
                        createdAt: new Date(),
                        likes: [],
                        dislikes: [],
                        store,
                        updatedAt: new Date(),
                        userName: user.name,
                        amount:
                          newProductAmount !== ""
                            ? parseInt(newProductAmount)
                            : undefined,
                        unit: unit !== "" ? unit : undefined,
                      },
                    ]);

                    setNewProduct("");
                    setNewProductAmount("");
                    setUnit("");
                    showCreateModal(false);

                    const postProduct = await fetchWithErrorHandler(
                      PRODUCTS_URL,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          id,
                          name: newProduct,
                          amount: newProductAmount,
                          unit,
                          createdUserName: user.name,
                          store,
                          buyStatus: toBuy
                            ? buyStatusList.BUY
                            : buyStatusList.BUY_VOTE,
                        }),
                      }
                    );
                    if (postProduct === "400") {
                      throw new Error("Produkty koshup bilmadim :(");
                    }

                    const updateUser = await fetchWithErrorHandler(USER_URL, {
                      method: "PUT",
                      body: JSON.stringify({
                        id: user.id,
                        name: user.name,
                        newProductId: id,
                      }),
                    });
                    if (updateUser === "400")
                      throw new Error("Produkty koshup bilmadim :(");

                    if (readyState === ReadyState.OPEN && sendMessage != null) {
                      sendMessage(
                        JSON.stringify({
                          action: "store",
                          message: WEBSOCKET_MESSAGE.update,
                        })
                      );
                    }

                    setProducts(await FetchProductList());

                    const notificationStatus = await fetchWithErrorHandler(
                      SEND_NOTIFICATION_URL,
                      {
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
                      }
                    );
                    if (notificationStatus === "400")
                      throw new Error("Bashgalara habar berip bilmadim :(");
                  } catch (e) {
                    // clean up and fetch new product list
                    const { message } = e as Error;
                    toggleMessage(true, "error", message);
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
    </Dialog>
  );
}
