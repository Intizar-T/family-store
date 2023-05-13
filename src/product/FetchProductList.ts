import { PRODUCTS_URL } from "../api/APIs";
import { fetchWithErrorHandler } from "../helpers/fetchWithErrorHandles";
import { Products, TabValueTypes } from "./ProductList";
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
  likes?: { L: { S: string }[] };
  dislikes?: { L: { S: string }[] };
};

const sortByDate = (a: Products, b: Products) => {
  if (a.createdAt > b.createdAt) return -1;
  if (a.createdAt < b.createdAt) return 1;
  return 0;
};

export default async function FetchProductList() {
  const fetchedProducts: APIProducts[] = await fetchWithErrorHandler(
    PRODUCTS_URL,
    {
      method: "GET",
    }
  );
  return fetchedProducts
    .map(
      ({
        buyStatus,
        createdAt,
        createdUserDevice,
        createdUserName,
        id,
        name,
        store,
        updatedAt,
        amount,
        boughtUserDevice,
        boughtUserName,
        dislikes,
        editedUserDevice,
        editedUserName,
        likes,
        unit,
      }) => {
        return {
          id: parseInt(id["S"]),
          name: name["S"],
          buyStatus: buyStatus["S"] as TabValueTypes,
          store: (store ? store["S"] : "other") as Store,
          createdAt: new Date(createdAt["S"]),
          updatedAt: new Date(updatedAt["S"]),
          userDevice: createdUserDevice["S"],
          userName: createdUserName["S"],
          likes: likes != null ? likes["L"].map(({ S }) => S) : [],
          dislikes: dislikes != null ? dislikes["L"].map(({ S }) => S) : [],
          amount:
            amount == null || amount["S"] === ""
              ? 0.0
              : parseFloat(amount["S"]),
          unit: unit && unit["S"],
          boughtUserDevice: boughtUserDevice && boughtUserDevice["S"],
          boughtUserName: boughtUserName && boughtUserName["S"],
          editedUserDevice: editedUserDevice && editedUserDevice["S"],
          editedUserName: editedUserName && editedUserName["S"],
        };
      }
    )
    .sort(sortByDate);
}
