import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToBuyList from "./ToBuyList";
import CreateProduct from "./CreateProduct";

export interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdUserName: string;
  amount: number;
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
  const [newProductAmount, setNewProductAmount] = useState("");
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
        justifyContent: "space-between",
      }}
    >
      <Grid item>
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
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
          <TabPanel
            value="Almaly"
            sx={{
              padding: 1,
              margin: 0,
              paddingRight: 0,
              overflow: "scroll",
            }}
          >
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
      <Grid item>
        <CreateProduct
          fetchProductList={fetchProductList}
          newProduct={newProduct}
          newProductAmount={newProductAmount}
          setLoading={setLoading}
          setNewProduct={setNewProduct}
          setNewProductAmount={setNewProductAmount}
          setProducts={setProducts}
          user={user}
        />
      </Grid>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Grid>
  );
}
