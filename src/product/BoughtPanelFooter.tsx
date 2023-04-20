import { Button } from "@mui/material";
import { useContext } from "react";
import ProductContext from "./ProductContext";
import { PRODUCTS_URL } from "../api/APIs";
import FetchProductList from "./FetchProductList";
import useLoading from "../helpers/useLoading";
import useMessage from "../helpers/useMessage";

export default function BoughtPanelFooter() {
  const { products, setProducts } = useContext(ProductContext);
  const [Loading, toggle] = useLoading();
  const [Message, toggleMessage] = useMessage();
  const boughtProductLength = products.filter(
    ({ isBought }) => isBought
  ).length;
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: 60,
        bottom: 0,
      }}
    >
      <Button
        disabled={boughtProductLength === 0}
        variant="contained"
        color="error"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        onClick={async () => {
          try {
            toggle(true);
            await Promise.all(
              products
                .filter(({ isBought }) => isBought)
                .map(async ({ id }) => {
                  await fetch(`${PRODUCTS_URL}?id=${id}`, {
                    method: "DELETE",
                  });
                })
            );
            setProducts(await FetchProductList());
            toggle(false);
            toggleMessage(true, "success", "produktlar udalit edildi");
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
        Hammasini Ochur
      </Button>
      <Loading />
      <Message />
    </div>
  );
}
