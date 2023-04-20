import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { TabValueTypes } from "./ProductList";
import { Store } from "./ToBuyList";

export type APIProducts = {
  createdAt: { S: string };
  createdUserDevice: { S: string };
  createdUserName: { S: string };
  id: { S: string };
  buyStatus: { S: string };
  name: { S: string };
  updatedAt: { S: string };
  store: { S: string };
  amount?: { S: string };
  unit?: { S: string };
  boughtUserDevice?: { S: string };
  boughtUserName?: { S: string };
  editedUserDevice?: { S: string };
  editedUserName?: { S: string };
};

export default async function FetchProductList() {
  const fetchedProducts: APIProducts[] = await fetchWithErrorHandler(
    PRODUCTS_URL,
    {
      method: "GET",
    }
  );
  return fetchedProducts.map((product) => {
    return {
      id: parseInt(product["id"]["S"]),
      name: product["name"]["S"],
      buyStatus: product["buyStatus"]["S"] as TabValueTypes,
      store: (product["store"] ? product["store"]["S"] : "other") as Store,
      createdAt: new Date(product["createdAt"]["S"]),
      updatedAt: new Date(product["updatedAt"]["S"]),
      userDevice: product["createdUserDevice"]["S"],
      userName: product["createdUserName"]["S"],
      amount:
        product["amount"] == null || product["amount"]["S"] === ""
          ? 0.0
          : parseFloat(product["amount"]["S"]),
      unit: product["unit"] && product["unit"]["S"],
      boughtUserDevice:
        product["boughtUserDevice"] && product["boughtUserDevice"]["S"],
      boughtUserName:
        product["boughtUserName"] && product["boughtUserName"]["S"],
      editedUserDevice:
        product["editedUserDevice"] && product["editedUserDevice"]["S"],
      editedUserName:
        product["editedUserName"] && product["editedUserName"]["S"],
    };
  });
}
