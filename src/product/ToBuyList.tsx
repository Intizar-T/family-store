import { List, Divider } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import EditProduct from "./EditProduct";
import useLoading from "../helpers/useLoading";
import ProductContext from "./ProductContext";
import useMessage from "../helpers/useMessage";
import { Products } from "./ProductList";
import ToBuyListItem from "./ToBuyListItem";

export type CreatedAt =
  | "all"
  | "today"
  | "yesterday"
  | "thisWeek"
  | "thisMonth";
export type Store = "pyatorychka" | "fixPrice" | "other";

export default function ToBuyList() {
  const [editModal, showEditModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Products>();
  const [Loading, toggle] = useLoading();
  const { products } = useContext(ProductContext);
  const [pyatorychkaProducts, setPyatorychkaProducts] = useState<Products[]>(
    []
  );
  const [fixPriceProducts, setFixPriceProducts] = useState<Products[]>([]);
  const [otherProducts, setOtherProducts] = useState<Products[]>([]);
  const [Message, toggleMessage] = useMessage();

  useMemo(() => {
    const isBoughtProducts = products.filter(({ isBought }) => !isBought);
    setPyatorychkaProducts(
      isBoughtProducts.filter(({ store }) => store === "pyatorychka")
    );
    setFixPriceProducts(
      isBoughtProducts.filter(({ store }) => store === "fixPrice")
    );
    setOtherProducts(isBoughtProducts.filter(({ store }) => store === "other"));
  }, [products]);

  return (
    <List
      sx={{
        bgcolor: "background.paper",
      }}
      style={{
        maxHeight: "calc(100vh - 230px)",
      }}
    >
      {pyatorychkaProducts.length !== 0 && (
        <React.Fragment>
          <Divider>Pyatorychka:</Divider>
          {pyatorychkaProducts.map((product) => (
            <ToBuyListItem
              product={product}
              setSelectedProduct={setSelectedProduct}
              setSelectedProductId={setSelectedProductId}
              showEditModal={showEditModal}
              toggle={toggle}
              toggleMessage={toggleMessage}
            />
          ))}
          <br />
        </React.Fragment>
      )}
      {fixPriceProducts.length !== 0 && (
        <React.Fragment>
          <Divider>Fix Price:</Divider>
          {fixPriceProducts.map((product) => (
            <ToBuyListItem
              product={product}
              setSelectedProduct={setSelectedProduct}
              setSelectedProductId={setSelectedProductId}
              showEditModal={showEditModal}
              toggle={toggle}
              toggleMessage={toggleMessage}
            />
          ))}
          <br />
        </React.Fragment>
      )}
      {otherProducts.length !== 0 && (
        <React.Fragment>
          <Divider>Bashga:</Divider>
          {otherProducts.map((product) => (
            <ToBuyListItem
              product={product}
              setSelectedProduct={setSelectedProduct}
              setSelectedProductId={setSelectedProductId}
              showEditModal={showEditModal}
              toggle={toggle}
              toggleMessage={toggleMessage}
            />
          ))}
        </React.Fragment>
      )}

      {editModal && selectedProduct && (
        <EditProduct
          selectedProductId={selectedProductId}
          product={selectedProduct}
          showEditModal={showEditModal}
        />
      )}
      <Loading />
      <Message />
    </List>
  );
}
