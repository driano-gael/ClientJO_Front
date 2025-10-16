import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ModalEvenement from '@/components/evenements/ModalEvenement';
import * as useEpreuveModule from '@/hook/useEpreuve';
import * as useOffreModule from '@/hook/useOffre';
import * as useReservationOfferModule from '@/hook/useReservationOffer';
import * as userContextModule from '@/context/userContext';
import panierSlice from '@/lib/reducer/panier/panierSlice';
import { Evenement } from '@/type/evenement/evenement';

// Mock des composants enfants
jest.mock('@/components/evenements/DisplayedOffre', () => {
  return function MockDisplayedOffre() {
    return <div data-testid="displayed-offre">Offres disponibles</div>;
  };
});

jest.mock('@/components/connexion/modalAuthentication', () => {
  return function MockModalAuth({ onCloseAction }: any) {
    return (
      <div data-testid="modal-auth">
        <button onClick={onCloseAction}>Fermer auth</button>
      </div>
    );
  };
});

const mockEvenement: Evenement = {
  id: 1,
  description: 'Finale 100m',
  date: '2024-08-01',
  horraire: '14:00:00',
  nb_place_restante: 100,
  nb_place_total: 80000,
  lieu: {
    id: 1,
    nom: 'Stade de France'
  },
  epreuves: [
    {
      id: 1,
      libelle: '100m',
      tour: 'Finale',
      genre: 'Hommes',
      discipline: {
        id: 1,
        nom: 'Athlétisme',
        icone: '/icons/athletisme.png'
      }
    }
  ]
};

const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice
  }
});

describe('ModalEvenement', () => {
  beforeEach(() => {
    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: [],
      loading: false,
      error: null
    });

    jest.spyOn(useReservationOfferModule, 'useReservationOffer').mockReturnValue({
      reservedOffers: [],
      reservePlaces: jest.fn(),
      unReservePlaces: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le modal avec les informations de l\'événement', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const onClose = jest.fn();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={onClose} />
      </Provider>
    );

    expect(screen.getByText(/Finale 100m/i)).toBeInTheDocument();
    expect(screen.getByText(/Stade de France/i)).toBeInTheDocument();
    expect(screen.getByText(/Athlétisme/i)).toBeInTheDocument();
  });

  it('affiche le spinner pendant le chargement', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: null,
      loading: true,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('affiche une erreur si le chargement échoue', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: null,
      loading: false,
      error: new Error('Erreur de chargement'),
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  it('ferme le modal quand on clique sur le bouton fermer', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const onClose = jest.fn();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={onClose} />
      </Provider>
    );

    const closeButton = screen.getByRole('button', { name: /✕/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('affiche les offres pour un utilisateur authentifié', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    expect(screen.getByTestId('displayed-offre')).toBeInTheDocument();
  });

  it('affiche le bouton de connexion pour un utilisateur non authentifié', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText(/Connectez-vous pour voir les offres/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('ouvre le modal d\'authentification au clic sur "Se connecter"', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    const connectButton = screen.getByRole('button', { name: /Se connecter/i });
    fireEvent.click(connectButton);

    expect(screen.getByTestId('modal-auth')).toBeInTheDocument();
  });

  it('calcule correctement les places restantes avec des réservations', () => {
    jest.spyOn(useEpreuveModule, 'useEvenementByEpreuveId').mockReturnValue({
      evenement: mockEvenement,
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: [{ id: 1, libelle: 'Solo', nb_personne: 1, montant: 50, description: 'Test' }],
      loading: false,
      error: null
    });

    jest.spyOn(useReservationOfferModule, 'useReservationOffer').mockReturnValue({
      reservedOffers: [{ evenementId: 1, offreId: 1, quantity: 2 }],
      reservePlaces: jest.fn(),
      unReservePlaces: jest.fn()
    });

    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      isLoading: false,
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <ModalEvenement epreuveId={1} onCloseAction={jest.fn()} />
      </Provider>
    );

    // 100 places - (1 personne * 2 réservations) = 98 places
    expect(screen.getByText(/PLACES RESTANTE : 98/i)).toBeInTheDocument();
  });
});
