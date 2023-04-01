import { createContext } from "react";
import { Products } from "./ProductList";

export type ProductsProps = {
  products: Products[];
  setProducts: (products: Products[]) => void;
};

export default createContext<ProductsProps>({
  products: [],
  setProducts: () => undefined,
});
