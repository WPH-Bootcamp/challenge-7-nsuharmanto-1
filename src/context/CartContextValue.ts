import { createContext } from "react";
import type { CartItem } from "../types";

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
export type { CartContextType };