import { configureStore } from '@reduxjs/toolkit';
import panierSlice from "@/lib/reducer/panier/panierSlice";

export const store = configureStore({
  reducer: {
    panier: panierSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;