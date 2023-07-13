/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
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
import BuyPanelFooter from "../footers/BuyPanelFooter";
import BoughtPanelFooter from "../footers/BoughtPanelFooter";
import BuyVoteList from "./BuyVoteList";
import BuyVotePanelFooter from "../footers/BuyVotePanelFooter";
import Duty from "../duty/Duty";
import WebSocketContext from "../context/WebSocketContext";
import { WEBSOCKET_MESSAGE } from "../App";
import i18next, { t } from "i18next";
import { withTranslation } from "react-i18next";
import useMessage from "../helpers/useMessage";

export type TabValueTypes = "buy" | "bought" | "buyVote" | "duty";
export interface Products {
  id: number;
  name: string;
  buyStatus: TabValueTypes;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  store: Store;
  likes: string[];
  dislikes: string[];
  amount?: number;
  unit?: string;
  boughtUserName?: string;
  editedUserName?: string;
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

function ProductList() {
  const [products, setProducts] = useState<Products[]>([]);
  const [newProduct, setNewProduct] = useState<string>("");
  const [newProductAmount, setNewProductAmount] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [tabValue, setTabValue] = useState<TabValueTypes>("buy");
  const [Loading, toggle] = useLoading();
  const [createModal, showCreateModal] = useState(false);
  const { lastMessage } = useContext(WebSocketContext);
  const [Message, toggleMessage] = useMessage();

  useEffect(() => {
    (async () => {
      toggle(true);
      setProducts(await FetchProductList());
      toggle(false);
    })();
  }, []);

  useEffect(() => {
    if (lastMessage == null) return;
    (async () => {
      const message = JSON.parse(lastMessage.data)["message"];
      if (message != null && message === WEBSOCKET_MESSAGE.update) {
        setProducts(await FetchProductList());
      }
    })();
  }, [lastMessage]);

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
                onChange={(e, value) => {
                  setTabValue(value);
                }}
                sx={{ paddingTop: 1 }}
                variant="scrollable"
              >
                <Tab value="buy" label={t("toBuy")} />
                <Tab value="buyVote" label={t("buyVote")} />
                <Tab value="bought" label={t("bought")} />
                {/* <Tab value="duty" label={t("duty")} /> */}
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
              {/* <TabPanel
                value="duty"
                sx={{
                  padding: 0,
                  margin: 0,
                  paddingRight: 0,
                }}
              >
                <Duty />
              </TabPanel> */}
            </Box>
          </TabContext>
        </Grid>

        {tabValue === "buy" && (
          <BuyPanelFooter showCreateModal={showCreateModal} />
        )}
        {tabValue === "bought" && <BoughtPanelFooter />}
        {/* {tabValue === "buyVote" && <BuyVotePanelFooter />} */}
        {/* {tabValue === "duty" && <DutyFooter />} */}
        {createModal && (
          <CreateProduct
            newProduct={newProduct}
            newProductAmount={newProductAmount}
            setNewProduct={setNewProduct}
            setNewProductAmount={setNewProductAmount}
            showCreateModal={showCreateModal}
            setUnit={setUnit}
            unit={unit}
            toggleMessage={toggleMessage}
          />
        )}
        <Loading />
        <Message />
      </Grid>
    </ProductContext.Provider>
  );
}

export default withTranslation()(ProductList);
