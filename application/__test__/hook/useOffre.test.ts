import { renderHook, waitFor } from '@testing-library/react';
import { useOffres } from '@/hook/useOffre';
import { OffreService } from '@/lib/api/service/offreService';

// Mock du service
jest.mock('@/lib/api/service/offreService', () => ({
  OffreService: {
    getAllOffre: jest.fn(),
  },
}));

const mockOffreService = OffreService as jest.Mocked<typeof OffreService>;

const mockOffres = [
  {
    id: 1,
    libelle: 'Catégorie 1',
    montant: 150.00,
    description: 'Places premium',
    nb_personne: 1,
  },
  {
    id: 2,
    libelle: 'Catégorie 2',
    montant: 100.00,
    description: 'Places standard',
    nb_personne: 2,
  }
];

describe('useOffres', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('charge les offres avec succès', async () => {
    mockOffreService.getAllOffre.mockResolvedValue(mockOffres);

    const { result } = renderHook(() => useOffres());

    // État initial
    expect(result.current.offres).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.offres).toEqual(mockOffres);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs de chargement', async () => {
    const errorMessage = 'Erreur lors du chargement des offres';
    mockOffreService.getAllOffre.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useOffres());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.offres).toEqual([]);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('appelle le service une seule fois', () => {
    mockOffreService.getAllOffre.mockResolvedValue([]);

    renderHook(() => useOffres());

    expect(mockOffreService.getAllOffre).toHaveBeenCalledTimes(1);
    expect(mockOffreService.getAllOffre).toHaveBeenCalledWith();
  });
});
