import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useReservationOffer } from '@/hook/useReservationOffer';
import panierSlice from '@/lib/reducer/panier/panierSlice';

// Store de test
const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice
  }
});

const renderHookWithProvider = <T,>(hook: () => T, store: ReturnType<typeof createTestStore>) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(hook, { wrapper });
};

describe('useReservationOffer', () => {
  it('initialise avec un panier vide', () => {
    const store = createTestStore();
    const { result } = renderHookWithProvider(() => useReservationOffer(), store);

    expect(result.current.reservedOffers).toEqual([]);
    expect(typeof result.current.reservePlaces).toBe('function');
    expect(typeof result.current.unReservePlaces).toBe('function');
  });

  it('ajoute une offre au panier', () => {
    const store = createTestStore();
    const { result } = renderHookWithProvider(() => useReservationOffer(), store);

    act(() => {
      result.current.reservePlaces(1, 2);
    });

    expect(result.current.reservedOffers).toHaveLength(1);
    expect(result.current.reservedOffers[0]).toEqual({
      evenementId: 1,
      offreId: 2,
      quantity: 1
    });
  });

  it('incrémente la quantité si l\'offre existe déjà', () => {
    const store = createTestStore();
    const { result } = renderHookWithProvider(() => useReservationOffer(), store);

    act(() => {
      result.current.reservePlaces(1, 2);
      result.current.reservePlaces(1, 2);
    });

    expect(result.current.reservedOffers).toHaveLength(1);
    expect(result.current.reservedOffers[0].quantity).toBe(2);
  });

  it('retire une offre du panier', () => {
    const store = createTestStore();
    const { result } = renderHookWithProvider(() => useReservationOffer(), store);

    act(() => {
      result.current.reservePlaces(1, 2);
      result.current.reservePlaces(1, 2);
    });

    expect(result.current.reservedOffers[0].quantity).toBe(2);

    act(() => {
      result.current.unReservePlaces(1, 2);
    });

    expect(result.current.reservedOffers[0].quantity).toBe(1);
  });

  it('supprime complètement l\'offre si la quantité devient 0', () => {
    const store = createTestStore();
    const { result } = renderHookWithProvider(() => useReservationOffer(), store);

    act(() => {
      result.current.reservePlaces(1, 2);
    });

    expect(result.current.reservedOffers).toHaveLength(1);

    act(() => {
      result.current.unReservePlaces(1, 2);
    });

    expect(result.current.reservedOffers).toHaveLength(0);
  });
});
