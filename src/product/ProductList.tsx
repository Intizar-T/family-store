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
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { SUBSCRIPTION_URL } from "../api/APIs";
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

// function notifyMe() {
//   if (!("Notification" in window)) {
//     alert("This browser does not support desktop notification");
//   } else if (Notification.permission === "granted") {
//     new Notification("Hi there!");
//   } else {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         new Notification("Hi there!");
//       }
//     });
//   }
// }

const mobileNotification = async () => {
  await Notification.requestPermission(async (result) => {
    if (result === "granted") {
      const registration: ServiceWorkerRegistration = await navigator
        .serviceWorker.ready;
      // save subscription to db
      const subscription: PushSubscription =
        await registration.pushManager.subscribe();
      await fetchWithErrorHandler(SUBSCRIPTION_URL, {
        method: "POST",
        body: JSON.stringify({
          subscription,
        }),
      });
      // .then((registration) => {
      //   registration.showNotification("Vibration Sample", {
      //     body: "Buzz! Buzz!",
      //     icon: "../images/touch/chrome-touch-icon-192x192.png",
      //     vibrate: [200, 100, 200, 100, 200, 100, 200],
      //     tag: "vibration-sample",
      //   });
      // });
    }
  });
};

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
                    // notifyMe();
                    await mobileNotification();
                  } catch (e) {
                    console.log(e);
                  }
                }}
                // sx={{ position: "absolute", bottom: 18, right: 4 }}
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
