import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import panierSlice, { addOneArticleToCart } from '@/lib/reducer/panier/panierSlice';

// Store de test
const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice
  }
});

const renderHookWithProvider = (hook: any, store: any) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(hook, { wrapper });
};

describe('Store Hooks', () => {
  describe('useAppDispatch', () => {
    it('retourne une fonction dispatch', () => {
      const store = createTestStore();
      const { result } = renderHookWithProvider(() => useAppDispatch(), store);

      expect(typeof result.current).toBe('function');
    });

    it('permet de dispatcher des actions', () => {
      const store = createTestStore();
      const { result: dispatchResult } = renderHookWithProvider(() => useAppDispatch(), store);
      const { result: selectorResult } = renderHookWithProvider(() =>
        useAppSelector(state => state.panier.items), store
      );

      expect(selectorResult.current).toHaveLength(0);

      // Dispatch une action avec act()
      act(() => {
        (dispatchResult.current as any)(addOneArticleToCart({
          evenementId: 1,
          offreId: 1
        }));
      });

      // Vérifier que l'état a été mis à jour
      expect(selectorResult.current).toHaveLength(1);
    });
  });

  describe('useAppSelector', () => {
    it('retourne les données du store', () => {
      const store = createTestStore();
      const { result } = renderHookWithProvider(() =>
        useAppSelector(state => state.panier.items), store
      );

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(0);
    });

    it('se met à jour quand le store change', () => {
      const store = createTestStore();
      const { result: dispatch } = renderHookWithProvider(() => useAppDispatch(), store);
      const { result: selector } = renderHookWithProvider(() =>
        useAppSelector(state => state.panier.items.length), store
      );

      expect(selector.current).toBe(0);

      act(() => {
        (dispatch.current as any)(addOneArticleToCart({
          evenementId: 1,
          offreId: 1
        }));
      });

      expect(selector.current).toBe(1);
    });
  });
});
