import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {addOneArticleToCart, removeOneArticleFromCart} from "@/lib/reducer/panier/panierSlice";


export function useReservationRedux() {
  const dispatch = useAppDispatch();
  const reservedOffers = useAppSelector(state => state.panier.items);

  const reservePlaces = (evenementId: number, offreId: number) => {
    dispatch(addOneArticleToCart({ evenementId: evenementId, offreId: offreId }));
  };

  const unReservePlaces = (evenementId: number, offreId: number) => {
    dispatch(removeOneArticleFromCart({ evenementId: evenementId, offreId: offreId }));
  };

  return { reservedOffers, reservePlaces, unReservePlaces };
}
