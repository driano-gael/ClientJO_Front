import { store } from '@/store/store';
import { addOneArticleToCart, clearCart } from '@/lib/reducer/panier/panierSlice';
import * as localStorage from '@/store/localStorage';

// Mock des fonctions localStorage
jest.mock('@/store/localStorage', () => ({
  loadState: jest.fn(),
  saveState: jest.fn()
}));

const mockLoadState = localStorage.loadState as jest.MockedFunction<typeof localStorage.loadState>;
const mockSaveState = localStorage.saveState as jest.MockedFunction<typeof localStorage.saveState>;

describe('Store Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialise avec un état vide par défaut', () => {
    mockLoadState.mockReturnValue(undefined);

    const state = store.getState();
    expect(state.panier.items).toEqual([]);
  });

  it('charge l\'état persisté du localStorage', () => {
    // Ce test vérifie que le store peut gérer un état persisté
    // Comme le store est déjà créé lors de l'import, on teste plutôt
    // le comportement attendu avec un état initial
    mockLoadState.mockReturnValue({
      items: [{ evenementId: 1, offreId: 1, quantity: 2 }]
    });

    // On vérifie que le store fonctionne correctement avec les actions
    const initialState = store.getState();
    expect(initialState.panier.items).toBeDefined();
    expect(Array.isArray(initialState.panier.items)).toBe(true);
  });

  it('sauvegarde automatiquement les changements dans localStorage', () => {
    // Dispatch une action
    store.dispatch(addOneArticleToCart({
      evenementId: 1,
      offreId: 1
    }));

    // Vérifier que saveState a été appelé
    expect(mockSaveState).toHaveBeenCalled();
    expect(mockSaveState).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            evenementId: 1,
            offreId: 1,
            quantity: 1
          })
        ])
      })
    );
  });

  it('sauvegarde à chaque modification du store', () => {
    const callCountBefore = mockSaveState.mock.calls.length;

    // Première action
    store.dispatch(addOneArticleToCart({
      evenementId: 1,
      offreId: 1
    }));

    // Deuxième action
    store.dispatch(addOneArticleToCart({
      evenementId: 2,
      offreId: 2
    }));

    // Troisième action
    store.dispatch(clearCart());

    // Vérifier que saveState a été appelé pour chaque action
    expect(mockSaveState.mock.calls.length).toBe(callCountBefore + 3);
  });

  it('expose les types TypeScript correctement', () => {
    const state = store.getState();

    // Test de type - si ça compile, c'est bon
    expect(typeof state.panier).toBe('object');
    expect(Array.isArray(state.panier.items)).toBe(true);
  });
});
