/**
 * Configure et exporte le store Redux de l'application.
 *
 * - Utilise le slice panier pour la gestion du panier d'achat.
 * - Charge l'état initial du panier depuis le localStorage si disponible.
 * - Sauvegarde automatiquement l'état du panier à chaque modification.
 * - Active les Redux DevTools en développement.
 *
 * @module store
 */
import { configureStore } from '@reduxjs/toolkit';
import panierSlice from "@/lib/reducer/panier/panierSlice";
import {loadState, saveState} from "@/store/localStorage";

/**
 * État du panier persistant chargé depuis le localStorage.
 */
const persistedState = loadState();

/**
 * Store Redux principal de l'application.
 */
export const store = configureStore({
  reducer: {
    panier: panierSlice,
  },
  preloadedState: persistedState ? { panier: persistedState } : undefined,
  devTools: process.env.NODE_ENV !== "production",
});

/**
 * Sauvegarde l'état du panier dans le localStorage à chaque modification du store.
 */
store.subscribe(() => {
  saveState(store.getState().panier);
});

/**
 * Type racine de l'état global Redux.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type du dispatcher Redux de l'application.
 */
export type AppDispatch = typeof store.dispatch;