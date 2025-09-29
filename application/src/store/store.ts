import { configureStore } from '@reduxjs/toolkit';
import panierSlice from "@/lib/reducer/panier/panierSlice";
import {loadState, saveState} from "@/store/localStorage";


const persistedState = loadState();
export const store = configureStore({
  reducer: {
    panier: panierSlice,
  },
    preloadedState: persistedState ? { panier: persistedState } : undefined,
    devTools: process.env.NODE_ENV !== "production",
});

store.subscribe(() => {
  saveState(store.getState().panier);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;