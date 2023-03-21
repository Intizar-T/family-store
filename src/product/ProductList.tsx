import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToBuyList from "./ToBuyList";

export interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdUserName: string;
}

interface ProductListProps {
  user: string;
}

const fetchProductList = async () => {
  const products: Products[] = await fetchWithErrorHandler(
    PRODUCTS_URL,
    "json",
    {
      method: "GET",
    }
  );
  return products;
};

export default function ProductList({ user }: ProductListProps) {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [newProductAmount, setNewProductAmount] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("Almaly");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setProducts((await Promise.all([fetchProductList()]))[0]);
      setLoading(false);
    })();
  }, []);
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid item>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              centered
              onChange={(e, value) => {
                setTabValue(value);
              }}
              sx={{ paddingTop: 1 }}
            >
              <Tab label="Almaly" value="Almaly" />
              <Tab label="Almalymy" value="Almalymy" />
              <Tab label="Alyndy" value="Alyndy" />
            </TabList>
          </Box>
          <TabPanel value="Almaly" sx={{ padding: 1, margin: 0 }}>
            <ToBuyList
              fetchProductList={fetchProductList}
              products={products}
              setLoading={setLoading}
              setProducts={setProducts}
            />
          </TabPanel>
          <TabPanel value="Almalymy">Item Two</TabPanel>
          <TabPanel value="Alyndy">Item Three</TabPanel>
        </TabContext>
      </Grid>
      <Grid
        item
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
        >
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
            }}
          />
          <TextField
            label="Kancha (sany ya kg):"
            color="success"
            value={newProductAmount}
            focused
            onChange={(e) => {
              setNewProductAmount(Number(e.target.value));
            }}
            sx={{
              margin: 1,
            }}
          />
        </Grid>
        <Button
          variant="contained"
          color="success"
          onClick={async () => {
            if (user !== "" && newProduct !== "") {
              setLoading(true);
              await fetchWithErrorHandler(PRODUCTS_URL, "json", {
                method: "post",
                body: JSON.stringify({
                  name: newProduct,
                  createdUserName: user,
                }),
              });
              setNewProduct("");
              setProducts((await Promise.all([fetchProductList()]))[0]);
              setLoading(false);
            }
          }}
          sx={{
            margin: 1,
            marginTop: 0,
          }}
        >
          Dobaw
        </Button>
      </Grid>
      {loading && (
        <Grid
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "50%",
          }}
        >
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
}
