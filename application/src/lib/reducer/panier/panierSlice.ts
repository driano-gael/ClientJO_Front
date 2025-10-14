import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {PanierState} from "@/type/achat/offrePanier";



const initialState: PanierState = {
  items: [],
};

/**
 * Slice Redux pour la gestion du panier d'achat.
 * Contient les actions et le reducer pour ajouter, retirer et vider les articles du panier.
 *
 * @module panierSlice
 */
const panierSlice = createSlice({
  name: 'panier',
  initialState,
  reducers: {
    /**
     * Ajoute un article au panier. Si l'article existe déjà, incrémente la quantité.
     *
     * @param state L'état actuel du panier.
     * @param action L'identifiant de l'événement et de l'offre à ajouter.
     */
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
    /**
     * Retire un article du panier. Décrémente la quantité ou supprime l'article si quantité = 1.
     *
     * @param state L'état actuel du panier.
     * @param action L'identifiant de l'événement et de l'offre à retirer.
     */
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
    /**
     * Vide complètement le panier.
     *
     * @param state L'état actuel du panier.
     */
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addOneArticleToCart, removeOneArticleFromCart, clearCart } =
  panierSlice.actions;
export default panierSlice.reducer;
