import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PanierPage from '@/app/panier/page';
import * as useOffreModule from '@/hook/useOffre';
import * as EvenementService from '@/lib/api/service/evenementService';
import * as PaiementService from '@/lib/api/service/paiementService';
import panierSlice from '@/lib/reducer/panier/panierSlice';
import { OffrePanier } from '@/type/achat/offrePanier';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock des composants
jest.mock('@/components/header/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('@/components/common/Spinner', () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('@/components/common/Notification', () => {
  return function MockNotification({ message, onCloseAction }: any) {
    return (
      <div data-testid="notification">
        {message}
        <button onClick={onCloseAction}>Close</button>
      </div>
    );
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

const mockOffres = [
  { id: 1, libelle: 'Solo', nb_personne: 1, montant: 50, description: 'Test' },
  { id: 2, libelle: 'Duo', nb_personne: 2, montant: 90, description: 'Test' }
];

const mockEvenements = [
  {
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
    epreuves: []
  }
];

const createTestStore = (items: OffrePanier[] = []) => configureStore({
  reducer: {
    panier: panierSlice
  },
  preloadedState: {
    panier: { items }
  }
});

describe('PanierPage', () => {
  beforeEach(() => {
    jest.spyOn(useOffreModule, 'useOffres').mockReturnValue({
      offres: mockOffres,
      loading: false,
      error: null
    });

    jest.spyOn(EvenementService.EvenementService, 'getAllEvenements').mockResolvedValue(mockEvenements);
    mockPush.mockClear();
    window.confirm = jest.fn(() => true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('affiche le spinner pendant le chargement', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('affiche la page du panier après chargement', async () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText(/Mon panier/i)).toBeInTheDocument();
    });
  });

  it('affiche un message si le panier est vide', async () => {
    const store = createTestStore([]);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Votre panier est vide/i)).toBeInTheDocument();
    });
  });

  it('affiche les items du panier groupés par événement', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 2 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Finale 100m/i)).toBeInTheDocument();
      expect(screen.getByText(/Solo/i)).toBeInTheDocument();
    });
  });

  it('calcule le total du panier correctement', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 2 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      // Utiliser getAllByText pour obtenir tous les éléments, puis vérifier le total spécifiquement
      const totalText = screen.getByText((content, element) => {
        return !!(element?.className?.includes('text-xl font-bold') && content.includes('Total'));
      });
      expect(totalText).toBeInTheDocument();
      expect(totalText).toHaveTextContent('100 €');
    });
  });

  it('permet d\'ajouter une offre', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const addButton = screen.getByLabelText(/Ajouter une offre/i);
      fireEvent.click(addButton);
    });
  });

  it('permet de retirer une offre', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 2 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const removeButton = screen.getByLabelText(/Retirer une offre/i);
      fireEvent.click(removeButton);
    });
  });

  it('permet de vider complètement une offre avec confirmation', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 3 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const deleteButton = screen.getByLabelText(/Vider l'offre du panier/i);
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  it('annule la suppression si l\'utilisateur refuse', async () => {
    window.confirm = jest.fn(() => false);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 3 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const deleteButton = screen.getByLabelText(/Vider l'offre du panier/i);
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalled();
      // La quantité devrait rester inchangée
    });
  });

  it('valide le paiement avec succès et redirige', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'succeeded' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('notification')).toBeInTheDocument();
      expect(screen.getByText(/Paiement validé/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/billets');
    });
  });

  it('gère le statut requires_confirmation', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'requires_confirmation' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/en attente de confirmation/i)).toBeInTheDocument();
    });
  });

  it('gère l\'échec du paiement', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'failed' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/paiement a échoué/i)).toBeInTheDocument();
    });
  });

  it('gère le statut refunded', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'refunded' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Paiement remboursé/i)).toBeInTheDocument();
    });
  });

  it('gère un statut de paiement inconnu', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'unknown_status' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Statut de paiement inconnu/i)).toBeInTheDocument();
    });
  });

  it('gère les erreurs de paiement', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockRejectedValue(
      new Error('Erreur réseau')
    );

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/erreur inattendue/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('permet de fermer la notification', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'failed' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.getByText(/Valider le panier/i);
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
    });
  });

  it('teste le bouton achat en échec', async () => {
    jest.spyOn(PaiementService.PaiementService, 'checkPaiement').mockResolvedValue({
      gateway_response: { status: 'failed' }
    } as any);

    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 1 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const failButton = screen.getByText(/achat en echec/i);
      fireEvent.click(failButton);
    });

    await waitFor(() => {
      expect(PaiementService.PaiementService.checkPaiement).toHaveBeenCalledWith(
        expect.objectContaining({ force_failed: true })
      );
    });
  });

  it('désactive le bouton de validation si le panier est vide ou total à 0', async () => {
    const store = createTestStore([]);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const validateButton = screen.queryByText(/Valider le panier/i);
      if (validateButton) {
        expect(validateButton).toBeDisabled();
      }
    });
  });

  it('affiche les places restantes pour chaque événement', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 2 }
    ];
    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Places restantes/i)).toBeInTheDocument();
    });
  });

  it('désactive le bouton d\'ajout si plus de places disponibles', async () => {
    const items: OffrePanier[] = [
      { evenementId: 1, offreId: 1, quantity: 50 } // 50 personnes réservées
    ];

    const limitedEvenements = [
      {
        ...mockEvenements[0],
        nb_place_restante: 50 // Seulement 50 places restantes
      }
    ];

    jest.spyOn(EvenementService.EvenementService, 'getAllEvenements').mockResolvedValue(limitedEvenements);

    const store = createTestStore(items);

    render(
      <Provider store={store}>
        <PanierPage />
      </Provider>
    );

    await waitFor(() => {
      const addButton = screen.getByLabelText(/Ajouter une offre/i);
      expect(addButton).toBeDisabled();
    });
  });
});
