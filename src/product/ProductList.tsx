import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToBuyList, { Store } from "./ToBuyList";
import CreateProduct from "./CreateProduct";
import useLoading from "../helpers/useLoading";
import ProductContext from "./ProductContext";
import FetchProductList from "./FetchProductList";
import BoughtList from "./BoughtList";
import BuyPanelFooter from "./BuyPanelFooter";
import BoughtPanelFooter from "./BoughtPanelFooter";
import BuyVoteList from "./BuyVoteList";
import BuyVotePanelFooter from "./BuyVotePanelFooter";

export type TabValueTypes = "buy" | "bought" | "buyVote";
export interface Products {
  id: number;
  name: string;
  buyStatus: TabValueTypes;
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
  likes?: string[];
  dislikes?: string[];
}

export enum buyStatusList {
  BUY = "buy",
  BOUGHT = "bought",
  BUY_VOTE = "buyVote",
}

export enum voteResult {
  LIKE = "like",
  DISLIKE = "dislike",
}

export default function ProductList() {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [newProductAmount, setNewProductAmount] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [tabValue, setTabValue] = useState<TabValueTypes>("buy");
  const [Loading, toggle] = useLoading();
  const [createModal, showCreateModal] = useState(false);

  useEffect(() => {
    (async () => {
      toggle(true);
      setProducts(await FetchProductList());
      toggle(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          height: "calc(100% - 60px)",
        }}
      >
        <Grid
          item
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <TabContext value={tabValue}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                height: 59,
              }}
            >
              <TabList
                centered
                onChange={(e, value) => {
                  setTabValue(value);
                }}
                sx={{ paddingTop: 1 }}
              >
                <Tab value="buy" label="Almaly" />
                <Tab value="buyVote" label="Almalymy" />
                <Tab value="bought" label="Alyndy" />
              </TabList>
            </Box>
            <Box
              sx={{
                overflowY: "scroll",
                height: "calc(100% - 60px)",
                borderBottom: 1,
                borderColor: "divider",
                marginBottom: 1,
              }}
            >
              <TabPanel
                value="buy"
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
                value="buyVote"
                sx={{
                  padding: 0,
                  margin: 0,
                  paddingRight: 0,
                }}
              >
                <BuyVoteList />
              </TabPanel>
              <TabPanel
                value="bought"
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

        {tabValue === "buy" && (
          <BuyPanelFooter showCreateModal={showCreateModal} />
        )}
        {tabValue === "bought" && <BoughtPanelFooter />}
        {tabValue === "buyVote" && <BuyVotePanelFooter />}
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
