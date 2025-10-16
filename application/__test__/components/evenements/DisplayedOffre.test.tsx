import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DisplayedOffre from '@/components/evenements/DisplayedOffre';
import { Offre } from '@/type/achat/offre';
import panierSlice from '@/lib/reducer/panier/panierSlice';
import * as useOffreModule from '@/hook/useOffre';

// Mock du composant enfant
jest.mock('@/components/evenements/CardOffre', () => {
  return function MockCardOffre({ offre }: any) {
    return <div data-testid={`offre-${offre.id}`}>{offre.libelle}</div>;
  };
});

const mockOffres: Offre[] = [
  {
    id: 1,
    libelle: 'Catégorie 1',
    nb_personne: 2,
    montant: 150,
    description: 'Premium'
  }
];

// Store de test
const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice
  }
});

describe('DisplayedOffre', () => {
  it('affiche les offres', () => {
    // Mock useOffres pour retourner les offres de test
    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: mockOffres,
      loading: false,
      error: null
    });

    const store = createTestStore();
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <Provider store={store}>
        <DisplayedOffre
          evenementId={1}
          remainingTickets={10}
          onReservePlaces={mockReserve}
          onUnReservePlaces={mockUnreserve}
        />
      </Provider>
    );

    expect(screen.getByTestId('offre-1')).toBeInTheDocument();
  });

  it('affiche un message de chargement', () => {
    // Mock useOffres en état de chargement
    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: [],
      loading: true,
      error: null
    });

    const store = createTestStore();
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <Provider store={store}>
        <DisplayedOffre
          evenementId={1}
          remainingTickets={10}
          onReservePlaces={mockReserve}
          onUnReservePlaces={mockUnreserve}
        />
      </Provider>
    );

    expect(screen.getByText(/Chargement des offres/i)).toBeInTheDocument();
  });

  it('rend un conteneur vide si aucune offre', () => {
    // Mock useOffres avec tableau vide
    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: [],
      loading: false,
      error: null
    });

    const store = createTestStore();
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    const { container } = render(
      <Provider store={store}>
        <DisplayedOffre
          evenementId={1}
          remainingTickets={10}
          onReservePlaces={mockReserve}
          onUnReservePlaces={mockUnreserve}
        />
      </Provider>
    );

    // Le composant rend mais sans offres
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
