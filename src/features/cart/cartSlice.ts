import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

type CartState = { items: CartItem[] };
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const found = state.items.find(i => i.id === action.payload.id);
      if (found) found.qty += action.payload.qty;
      else state.items.push(action.payload);
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const it = state.items.find(i => i.id === action.payload.id);
      if (it) it.qty = Math.max(1, action.payload.qty);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart: (state) => { state.items = []; }
  }
});

export const { addToCart, updateQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
