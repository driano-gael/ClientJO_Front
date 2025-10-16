import { renderHook, waitFor, act } from '@testing-library/react';
import { useEpreuvesCards, useEpreuves, useEvenementByEpreuveId } from '@/hook/useEpreuve';
import { EpreuveService } from '@/lib/api/service/epreuveService';
import { EvenementService } from '@/lib/api/service/evenementService';
import { EpreuveCardType, Epreuve } from '@/type/evenement/epreuve';
import { Evenement } from '@/type/evenement/evenement';

// Mock des services
jest.mock('@/lib/api/service/epreuveService');
jest.mock('@/lib/api/service/evenementService');

const mockEpreuveService = EpreuveService as jest.Mocked<typeof EpreuveService>;
const mockEvenementService = EvenementService as jest.Mocked<typeof EvenementService>;

const mockEpreuveCards: EpreuveCardType[] = [
  {
    id: 1,
    discipline: 'Natation',
    lieu: 'Centre Aquatique',
    date: '2024-07-26',
    dateRaw: '2024-07-26T10:00:00Z',
    heure: '10:00',
    tour: 'Finale',
    libelle: 'Finale 100m nage libre',
    genre: 'Hommes',
    icone: "athl.svg"
  }
];

const mockEpreuves: Epreuve[] = [
  {
    id: 1,
    libelle: 'Finale 100m nage libre',
    discipline: {
      id: 1,
      nom: 'Natation',
      icone: '/icons/natation.svg'
    },
    genre: 'Hommes',
    tour: 'Finale'
  }
];

const mockEvenement: Evenement = {
  id: 1,
  description: 'Finale du 100m nage libre',
  date: '2024-07-26T10:00:00Z',
  lieu: {
    id: 1,
    nom: 'Centre Aquatique'
  },
  horraire: '10:00',
  epreuves: [],
  nb_place_total: 1000,
  nb_place_restante: 500
};

describe('useEpreuve hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEpreuvesCards', () => {
    it('charge les épreuves au format carte avec succès', async () => {
      mockEpreuveService.getAllEvenementsAsCards.mockResolvedValue(mockEpreuveCards);

      const { result } = renderHook(() => useEpreuvesCards());

      expect(result.current.loading).toBe(true);
      expect(result.current.epreuves).toEqual([]);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.epreuves).toEqual(mockEpreuveCards);
      expect(result.current.error).toBe(null);
      expect(mockEpreuveService.getAllEvenementsAsCards).toHaveBeenCalledWith(undefined);
    });

    it('charge les épreuves avec des filtres initiaux', async () => {
      const filters = { disciplineId: 1 };
      mockEpreuveService.getAllEvenementsAsCards.mockResolvedValue(mockEpreuveCards);

      renderHook(() => useEpreuvesCards(filters));

      await waitFor(() => {
        expect(mockEpreuveService.getAllEvenementsAsCards).toHaveBeenCalledWith(filters);
      });
    });

    it('gère les erreurs de chargement', async () => {
      const error = new Error('Erreur réseau');
      mockEpreuveService.getAllEvenementsAsCards.mockRejectedValue(error);

      const { result } = renderHook(() => useEpreuvesCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.epreuves).toEqual([]);
      expect(result.current.error).toBe(error);
    });

    it('permet de rafraîchir les données', async () => {
      mockEpreuveService.getAllEvenementsAsCards.mockResolvedValue(mockEpreuveCards);

      const { result } = renderHook(() => useEpreuvesCards());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Rafraîchir avec de nouveaux filtres
      const newFilters = { libelle: 'natation' };
      result.current.fetchEpreuves(newFilters);

      await waitFor(() => {
        expect(mockEpreuveService.getAllEvenementsAsCards).toHaveBeenCalledWith(newFilters);
      });
    });
  });

  describe('useEpreuves', () => {
    it('charge les épreuves avec succès', async () => {
      mockEpreuveService.getAllEpreuves.mockResolvedValue(mockEpreuves);

      const { result } = renderHook(() => useEpreuves());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.epreuves).toEqual(mockEpreuves);
      expect(result.current.error).toBe(null);
    });

    it('gère les erreurs', async () => {
      const error = new Error('Erreur API');
      mockEpreuveService.getAllEpreuves.mockRejectedValue(error);

      const { result } = renderHook(() => useEpreuves());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.epreuves).toEqual([]);
      expect(result.current.error).toBe(error);
    });
  });

  describe('useEvenementByEpreuveId', () => {
    it('charge un événement par ID d\'épreuve', async () => {
      mockEvenementService.getEvenementByEpreuveId.mockResolvedValue(mockEvenement);

      const { result } = renderHook(() => useEvenementByEpreuveId(1));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.evenement).toEqual(mockEvenement);
      expect(result.current.error).toBe(null);
      expect(mockEvenementService.getEvenementByEpreuveId).toHaveBeenCalledWith(1);
    });

    it('ne charge pas si ID est 0 ou falsy', () => {
      renderHook(() => useEvenementByEpreuveId(0));

      expect(mockEvenementService.getEvenementByEpreuveId).not.toHaveBeenCalled();
    });

    it('gère les erreurs de chargement', async () => {
      const error = new Error('Événement non trouvé');
      mockEvenementService.getEvenementByEpreuveId.mockRejectedValue(error);

      const { result } = renderHook(() => useEvenementByEpreuveId(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.evenement).toBe(null);
      expect(result.current.error).toBe(error);
    });

    it('permet de relancer le chargement avec refetch', async () => {
      mockEvenementService.getEvenementByEpreuveId.mockResolvedValue(mockEvenement);

      const { result } = renderHook(() => useEvenementByEpreuveId(1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Relancer le chargement avec act()
      await act(async () => {
        await result.current.refetch();
      });

      // Vérifier que le service a été appelé deux fois (montage + refetch)
      await waitFor(() => {
        expect(mockEvenementService.getEvenementByEpreuveId).toHaveBeenCalledTimes(2);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.evenement).toEqual(mockEvenement);
    });
  });
});
