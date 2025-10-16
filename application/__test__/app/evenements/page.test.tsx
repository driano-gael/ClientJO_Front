import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Evenements from '@/app/evenements/page';
import * as useEpreuveModule from '@/hook/useEpreuve';
import * as useEpreuveFilteredModule from '@/hook/useEpreuveFiltered';
import panierSlice from '@/lib/reducer/panier/panierSlice';
import { Epreuve } from '@/type/evenement/epreuve';

// Mock des composants
jest.mock('@/components/header/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('@/components/evenements/CarousselEpreuve', () => {
  return function MockCarousselEpreuve({ epreuves, onCardClickAction }: any) {
    return (
      <div data-testid="carrousel">
        {epreuves?.map((e: any) => (
          <button key={e.id} onClick={() => onCardClickAction(e.id)}>
            {e.libelle}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/evenements/searchEpreuve', () => {
  return function MockSearchEpreuve({ onFiltersChange }: any) {
    return (
      <div data-testid="search">
        <button onClick={() => onFiltersChange({ discipline: 'Test' })}>
          Filtrer
        </button>
      </div>
    );
  };
});

jest.mock('@/components/evenements/DisplayedEpreuves', () => {
  return function MockDisplayedEpreuves({ epreuves, onCardClickAction }: any) {
    return (
      <div data-testid="displayed-epreuves">
        {epreuves?.map((e: any) => (
          <button key={e.id} onClick={() => onCardClickAction(e.id)}>
            {e.libelle}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/evenements/ModalEvenement', () => {
  return function MockModalEvenement({ epreuveId, onCloseAction }: any) {
    return (
      <div data-testid="modal">
        Modal {epreuveId}
        <button onClick={onCloseAction}>Fermer</button>
      </div>
    );
  };
});

jest.mock('@/components/common/Spinner', () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('@/components/common/Notification', () => {
  return function MockNotification({ message }: any) {
    return <div data-testid="notification">{message}</div>;
  };
});

const mockEpreuves: Epreuve[] = [
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
];

const createTestStore = () => configureStore({
  reducer: {
    panier: panierSlice
  }
});

describe('Evenements Page', () => {
  beforeEach(() => {
    jest.spyOn(useEpreuveFilteredModule, 'useFilteredEpreuves').mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche la page des événements', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: mockEpreuves,
      loading: false,
      error: null,
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('carrousel')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('displayed-epreuves')).toBeInTheDocument();
  });

  it('affiche le spinner pendant le chargement', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: [],
      loading: true,
      error: null,
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('affiche une notification en cas d\'erreur', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: [],
      loading: false,
      error: new Error('Erreur de chargement'),
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });

  it('ouvre le modal au clic sur une épreuve', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: mockEpreuves,
      loading: false,
      error: null,
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    const epreuveButton = screen.getByText('100m');
    fireEvent.click(epreuveButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('ferme le modal au clic sur fermer', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: mockEpreuves,
      loading: false,
      error: null,
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    // Ouvrir le modal
    const epreuveButton = screen.getByText('100m');
    fireEvent.click(epreuveButton);

    // Fermer le modal
    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('applique les filtres de recherche', () => {
    jest.spyOn(useEpreuveModule, 'useEpreuves').mockReturnValue({
      epreuves: mockEpreuves,
      loading: false,
      error: null,
      fetchEpreuves: jest.fn()
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <Evenements />
      </Provider>
    );

    const filterButton = screen.getByText('Filtrer');
    fireEvent.click(filterButton);

    // Vérifie que le composant fonctionne sans erreur
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });
});
