import { OffreService } from '@/lib/api/service/offreService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

// Mock fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('OffreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOffre', () => {
    it('appelle fetchApi sans filtres', async () => {
      const mockOffres = [
        {
          id: 1,
          libelle: 'Catégorie 1',
          prix: 150.00,
          description: 'Places premium',
          nb_places_disponibles: 50,
          evenement: 1
        },
        {
          id: 2,
          libelle: 'Catégorie 2',
          prix: 100.00,
          description: 'Places standard',
          nb_places_disponibles: 100,
          evenement: 1
        }
      ];

      mockFetchApi.mockResolvedValue(mockOffres);

      const result = await OffreService.getAllOffre();

      expect(mockFetchApi).toHaveBeenCalledWith('/offre/', {}, true);
      expect(result).toEqual(mockOffres);
    });

    it('gère les erreurs de fetchApi', async () => {
      const error = new Error('Erreur réseau');
      mockFetchApi.mockRejectedValue(error);

      await expect(OffreService.getAllOffre()).rejects.toThrow('Erreur réseau');
    });

    it('retourne un tableau vide si aucune offre disponible', async () => {
      mockFetchApi.mockResolvedValue([]);

      const result = await OffreService.getAllOffre();

      expect(mockFetchApi).toHaveBeenCalledWith('/offre/', {}, true);
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
