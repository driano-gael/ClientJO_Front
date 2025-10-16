import { configureStore } from '@reduxjs/toolkit';
import panierSlice, { addOneArticleToCart, removeOneArticleFromCart, clearCart } from '@/lib/reducer/panier/panierSlice';
import { PanierState } from '@/type/achat/offrePanier';

// Type pour le store de test
type TestStore = ReturnType<typeof createTestStore>;
type RootState = {
  panier: PanierState;
};

const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice,
  },
});

describe('panierSlice', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  const mockItem = {
    evenementId: 1,
    offreId: 1
  };

  describe('addOneArticleToCart', () => {
    it('ajoute un nouvel article au panier', () => {
      store.dispatch(addOneArticleToCart(mockItem));

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        evenementId: 1,
        offreId: 1,
        quantity: 1
      });
    });

    it('incrémente la quantité si l\'article existe déjà', () => {
      store.dispatch(addOneArticleToCart(mockItem));
      store.dispatch(addOneArticleToCart(mockItem));

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('ajoute différents articles', () => {
      const item2 = { evenementId: 2, offreId: 2 };

      store.dispatch(addOneArticleToCart(mockItem));
      store.dispatch(addOneArticleToCart(item2));

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(2);
    });
  });

  describe('removeOneArticleFromCart', () => {
    beforeEach(() => {
      store.dispatch(addOneArticleToCart(mockItem));
      store.dispatch(addOneArticleToCart(mockItem));
      store.dispatch(addOneArticleToCart(mockItem));
    });

    it('décrémente la quantité d\'un article', () => {
      store.dispatch(removeOneArticleFromCart(mockItem));

      const state = (store.getState() as RootState).panier;
      expect(state.items[0].quantity).toBe(2);
    });

    it('supprime l\'article si la quantité devient 0', () => {
      store.dispatch(removeOneArticleFromCart(mockItem));
      store.dispatch(removeOneArticleFromCart(mockItem));
      store.dispatch(removeOneArticleFromCart(mockItem));

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(0);
    });

    it('ne fait rien si l\'article n\'existe pas', () => {
      const nonExistentItem = { evenementId: 999, offreId: 999 };
      store.dispatch(removeOneArticleFromCart(nonExistentItem));

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('vide complètement le panier', () => {
      store.dispatch(addOneArticleToCart(mockItem));
      store.dispatch(addOneArticleToCart({ evenementId: 2, offreId: 2 }));

      store.dispatch(clearCart());

      const state = (store.getState() as RootState).panier;
      expect(state.items).toHaveLength(0);
    });
  });

  describe('état initial', () => {
    it('initialise avec un panier vide', () => {
      const state = (store.getState() as RootState).panier;
      expect(state.items).toEqual([]);
    });
  });
});
