import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";

/**
 * Hook typé pour dispatcher des actions Redux
 * @returns Fonction dispatch typée avec AppDispatch
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(addToCart({ evenementId: 1, offreId: 2, quantity: 1 }));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook typé pour sélectionner des données du store Redux
 * @example
 * const cartItems = useAppSelector(state => state.panier.items);
 * const itemCount = useAppSelector(state => state.panier.items.length);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;