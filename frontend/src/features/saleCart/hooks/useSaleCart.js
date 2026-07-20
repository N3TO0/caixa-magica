import { useContext } from "react";
import { SaleCartContext } from "../context/SaleCartContext";

export function useSaleCart() {
  return useContext(SaleCartContext);
}
