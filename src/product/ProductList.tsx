import { Button, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToBuyList from "./ToBuyList";
import CreateProduct from "./CreateProduct";
import UserContext from "../UserContext";
import useLoading from "../helpers/useLoading";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

export interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  userDevice: string;
  userName: string;
  amount?: number;
  unit?: string;
}

interface ProductListProps {
  device: string;
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

export default function ProductList({ device }: ProductListProps) {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [newProductAmount, setNewProductAmount] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [tabValue, setTabValue] = useState("Almaly");
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [createModal, showCreateModal] = useState(false);

  useEffect(() => {
    if (user == null) return;
    (async () => {
      toggle(true);
      setProducts((await Promise.all([fetchProductList()]))[0]);
      toggle(false);
    })();
  }, [user]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        paddingBottom: 2,
      }}
    >
      <Grid item>
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderTop: 1,
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
            }}
          >
            <ToBuyList
              fetchProductList={fetchProductList}
              products={products}
              setProducts={setProducts}
            />
          </TabPanel>
          <TabPanel value="Almalymy">Hali onarylotran...</TabPanel>
          <TabPanel value="Alyndy">Hali onarylotran...</TabPanel>
        </TabContext>
      </Grid>
      <Grid item display="flex" justifyContent="center">
        <Button
          onClick={() => {
            showCreateModal(true);
          }}
        >
          <AddCircleOutlineOutlinedIcon
            color="primary"
            sx={{
              fontSize: 45,
            }}
          />
        </Button>
      </Grid>
      {createModal && (
        <CreateProduct
          fetchProductList={fetchProductList}
          newProduct={newProduct}
          newProductAmount={newProductAmount}
          setNewProduct={setNewProduct}
          setNewProductAmount={setNewProductAmount}
          setProducts={setProducts}
          showCreateModal={showCreateModal}
          setUnit={setUnit}
          unit={unit}
        />
      )}
      <Loading />
    </Grid>
  );
}
