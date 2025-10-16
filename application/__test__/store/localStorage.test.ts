import { loadState, saveState } from '@/store/localStorage';
import { PanierState } from '@/type/achat/offrePanier';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('loadState', () => {
    it('retourne undefined si rien dans localStorage', () => {
      const result = loadState();
      expect(result).toBeUndefined();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('panier');
    });

    it('charge et parse les données du localStorage', () => {
      const testState: PanierState = {
        items: [{ evenementId: 1, offreId: 1, quantity: 2 }]
      };
      localStorageMock.setItem('panier', JSON.stringify(testState));

      const result = loadState();

      expect(result).toEqual(testState);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('panier');
    });

    it('retourne undefined en cas d\'erreur de parsing', () => {
      localStorageMock.setItem('panier', 'invalid json');

      const result = loadState();

      expect(result).toBeUndefined();
    });

    it('gère le cas où localStorage lance une exception', () => {
      jest.spyOn(localStorageMock, 'getItem').mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      const result = loadState();

      expect(result).toBeUndefined();
    });
  });

  describe('saveState', () => {
    it('sauvegarde l\'état dans localStorage', () => {
      const testState: PanierState = {
        items: [{ evenementId: 1, offreId: 1, quantity: 3 }]
      };

      saveState(testState);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'panier',
        JSON.stringify(testState)
      );
    });

    it('gère les erreurs de sauvegarde silencieusement', () => {
      jest.spyOn(localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const testState: PanierState = {
        items: [{ evenementId: 1, offreId: 1, quantity: 1 }]
      };

      // Ne devrait pas lever d'erreur
      expect(() => saveState(testState)).not.toThrow();
    });
  });
});
