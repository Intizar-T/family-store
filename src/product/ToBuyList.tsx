import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import EditProduct from "./EditProduct";
import useLoading from "../helpers/useLoading";
import CheckIcon from "@mui/icons-material/Check";
import FetchProductList from "./FetchProductList";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import ProductContext from "./ProductContext";
import UserContext from "../UserContext";
import useMessage from "../helpers/useMessage";
import { Products } from "./ProductList";

export type CreatedAt =
  | "all"
  | "today"
  | "yesterday"
  | "thisWeek"
  | "thisMonth";
export type Store = "all" | "pyatrorychka" | "fixPrice" | "other";

const filterProducts = (
  products: Products[],
  createdAt?: CreatedAt,
  selectedStore?: Store
): Products[] => {
  let filteringInProgressProducts: Products[] = products;
  if (selectedStore != null && selectedStore !== "all")
    filteringInProgressProducts = products.filter(({ store }) => {
      // console.log(`${store} and ${selectedStore}`);
      return store === selectedStore;
    });
  // console.log(filteringInProgressProducts);
  // if (createdAt != null) {
  //   if (createdAt === "all")
  //     return filteringInProgressProducts.filter(({ isBought }) => !isBought);
  //   const yesterday = new Date();
  //   switch (createdAt) {
  //     case "today":
  //       yesterday.setDate(yesterday.getDate());
  //       break;
  //     case "yesterday":
  //       yesterday.setDate(yesterday.getDate() - 1);
  //       break;
  //     case "thisWeek":
  //       yesterday.setDate(yesterday.getDate() - 7);
  //       break;
  //     case "thisMonth":
  //       yesterday.setDate(yesterday.getDate() - 30);
  //   }
  //   return filteringInProgressProducts.filter(({ createdAt, isBought }) => {
  //     console.log(`${createdAt.getDate()} and ${yesterday.getDate()}`);
  //     return createdAt.getDate() >= yesterday.getDate() && !isBought;
  //   });
  // }
  return filteringInProgressProducts.filter(({ isBought }) => !isBought);
};

export default function ToBuyList() {
  const [editModal, showEditModal] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductAmount, setEditedProductAmount] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [Loading, toggle] = useLoading();
  const { products, setProducts } = useContext(ProductContext);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const { user } = useContext(UserContext);
  const [Message, toggleMessage] = useMessage();
  const [createdAt, setCreatedAt] = useState<CreatedAt>("all");
  const [store, setStore] = useState<Store>("pyatrorychka");

  useMemo(() => {
    setFilteredProducts(filterProducts(products, createdAt, store));
  }, [products, createdAt, store]);

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        overflowY: "scroll",
      }}
      style={{
        maxHeight: "calc(100vh - 230px)",
      }}
    >
      <ListItem
        sx={{
          paddingRight: 2,
        }}
      >
        <Grid display="flex" flexDirection="row" sx={{ width: "100%" }}>
          <FormControl fullWidth sx={{ marginRight: 1 }}>
            <InputLabel>Kaysy Magazin</InputLabel>
            <Select
              value={store}
              label="Kaysy Magazin:"
              onChange={(e) => {
                setStore(e.target.value as Store);
              }}
            >
              <MenuItem value={"all"}>Opshi</MenuItem>
              <MenuItem value={"pyatrorychka"}>Pyatrorychka</MenuItem>
              <MenuItem value={"fixPrice"}>Fix Price</MenuItem>
              <MenuItem value={"other"}>Bashga</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth disabled>
            <InputLabel>Kacan doradildi</InputLabel>
            <Select
              value={createdAt}
              label="Kacan doradildi:"
              onChange={(e) => {
                setCreatedAt(e.target.value as CreatedAt);
              }}
            >
              <MenuItem value={"all"}>Hammasi</MenuItem>
              <MenuItem value={"today"}>Shu gun</MenuItem>
              <MenuItem value={"yesterday"}>Otan gun</MenuItem>
              <MenuItem value={"thisWeek"}>Shu hapda</MenuItem>
              <MenuItem value={"thisMonth"}>Shu ay</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </ListItem>
      {filteredProducts.map((product) => (
        <ListItem
          key={product.id}
          secondaryAction={
            <React.Fragment>
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedProductId(product.id);
                  setEditedProductName(product.name);
                  setEditedProductAmount(`${product.amount}`);
                  setEditedUnit(product.unit || "");
                  showEditModal(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ mr: 1 }}
                color="success"
                onClick={async () => {
                  try {
                    toggle(true);
                    await fetchWithErrorHandler(`${PRODUCTS_URL}`, {
                      method: "PUT",
                      body: JSON.stringify({
                        id: product.id.toString(),
                        isBought: "true",
                        boughtUserDevice: user?.device,
                        boughtUserName: user?.name,
                      }),
                    });
                    setProducts(await FetchProductList());
                    toggle(false);
                    toggleMessage(
                      true,
                      "success",
                      "produckt 'Alyndy' lista koshyldy"
                    );
                    setTimeout(() => {
                      toggleMessage(false);
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
                <CheckIcon />
              </IconButton>
            </React.Fragment>
          }
          sx={{ width: "100%", paddingY: 1, paddingRight: 8 }}
        >
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${product.name} ${
              product.amount !== 0 && product.unit != null
                ? "- " + product.amount + " " + product.unit
                : ""
            }`}
            secondary={
              <React.Fragment>
                <Typography fontSize="small" color="red">
                  Doratdi: {product.userName}
                </Typography>
                {product.editedUserName && (
                  <Typography fontSize="small" color="#1976D2">
                    Uytgatdi: {product.editedUserName}
                  </Typography>
                )}
                {/* {product.boughtUserName && (
                    <Typography fontSize="small" color="#2e7d32">
                      Satyn aldy: {product.boughtUserName}
                    </Typography>
                  )} */}
              </React.Fragment>
            }
            sx={{ marginRight: 4, overflowWrap: "break-word" }}
          />
        </ListItem>
      ))}
      {editModal && (
        <EditProduct
          editedProductAmount={editedProductAmount}
          editedProductName={editedProductName}
          selectedProductId={selectedProductId}
          setEditedProductAmount={setEditedProductAmount}
          setEditedProductName={setEditedProductName}
          showEditModal={showEditModal}
          editedUnit={editedUnit}
          setEditedUnit={setEditedUnit}
        />
      )}
      <Loading />
      <Message />
    </List>
  );
}
