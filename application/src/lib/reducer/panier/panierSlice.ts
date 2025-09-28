import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {OffrePanier} from "@/type/achat/offrePanier";


interface PanierState {
  items: OffrePanier[];
}

const initialState: PanierState = {
  items: [],
};

const panierSlice = createSlice({
  name: 'panier',
  initialState,
  reducers: {

    addOneArticleToCart: (
      state,
      action: PayloadAction<{ evenementId: number; offreId: number }>
    ) => {
      const { evenementId, offreId } = action.payload;
      const existing = state.items.find(
        (item) => item.evenementId === evenementId && item.offreId === offreId
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ evenementId, offreId, quantity: 1 });
      }
    },

    removeOneArticleFromCart: (
      state,
      action: PayloadAction<{ evenementId: number; offreId: number }>
    ) => {
      const { evenementId, offreId } = action.payload;
      const existing = state.items.find(
        (item) => item.evenementId === evenementId && item.offreId === offreId
      );

      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => !(item.evenementId === evenementId && item.offreId === offreId)
          );
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addOneArticleToCart, removeOneArticleFromCart, clearCart } =
  panierSlice.actions;
export default panierSlice.reducer;
