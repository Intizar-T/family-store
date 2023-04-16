import { Button, Grid, Tooltip } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToBuyList, { Store } from "./ToBuyList";
import CreateProduct from "./CreateProduct";
import UserContext from "../UserContext";
import useLoading from "../helpers/useLoading";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import BoughtList from "./BoughtList";
import { registerServiceWorker } from "../helpers/notificationSubscription";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
export interface Products {
  id: number;
  name: string;
  isBought: boolean;
  createdAt: Date;
  updatedAt: Date;
  userDevice: string;
  userName: string;
  store: Store;
  amount?: number;
  unit?: string;
  boughtUserDevice?: string;
  boughtUserName?: string;
  editedUserDevice?: string;
  editedUserName?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [newProductAmount, setNewProductAmount] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [tabValue, setTabValue] = useState("Almaly");
  const { user } = useContext(UserContext);
  const [Loading, toggle] = useLoading();
  const [createModal, showCreateModal] = useState(false);

  useEffect(() => {
    (async () => {
      toggle(true);
      setProducts(await FetchProductList());
      toggle(false);
    })();
  }, []);

  const productState = useMemo(() => {
    return { products, setProducts };
  }, [products]);

  return (
    <ProductContext.Provider value={productState}>
      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",
          paddingBottom: 2,
        }}
      >
        <Grid
          item
          sx={{
            width: "100%",
            height: "100%",
            // height: "calc(100% - 120px)",
          }}
        >
          <TabContext value={tabValue}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                height: 60,
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
            <Box
              sx={{
                overflowY: "scroll",
                height: "calc(100% - 110px)",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabPanel
                value="Almaly"
                sx={{
                  padding: 0,
                  margin: 0,
                  paddingRight: 0,
                  height: "100%",
                }}
              >
                <ToBuyList />
              </TabPanel>
              <TabPanel
                value="Almalymy"
                sx={{
                  padding: 0,
                  margin: 0,
                  paddingRight: 0,
                }}
              >
                Hali onarylotran...
              </TabPanel>
              <TabPanel
                value="Alyndy"
                sx={{
                  padding: 0,
                  margin: 0,
                  paddingRight: 0,
                  height: "100%",
                }}
              >
                <BoughtList />
              </TabPanel>
            </Box>
          </TabContext>
        </Grid>

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 60,
            bottom: 0,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Tooltip title="Taza produkt kosh">
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
            </Tooltip>
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <Tooltip title="Bashgalara magazindadigini duydur">
              <Button
                onClick={async () => {
                  try {
                    console.log(
                      "implement sending notifications to others when near a store"
                    );
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <NotificationsActiveOutlinedIcon
                  color="primary"
                  sx={{
                    fontSize: 45,
                  }}
                />
              </Button>
            </Tooltip>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
            }}
          >
            <Tooltip title="Magazinin soobsheniyalaryna yazyl">
              <Button
                onClick={async () => {
                  try {
                    await registerServiceWorker();
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <AlternateEmailIcon
                  color="primary"
                  sx={{
                    fontSize: 45,
                  }}
                />
              </Button>
            </Tooltip>
          </div>
        </div>
        {createModal && (
          <CreateProduct
            newProduct={newProduct}
            newProductAmount={newProductAmount}
            setNewProduct={setNewProduct}
            setNewProductAmount={setNewProductAmount}
            showCreateModal={showCreateModal}
            setUnit={setUnit}
            unit={unit}
          />
        )}
        <Loading />
      </Grid>
    </ProductContext.Provider>
  );
}
