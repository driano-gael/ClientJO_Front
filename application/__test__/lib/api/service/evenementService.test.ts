import { EvenementService, EvenementFilters } from '@/lib/api/service/evenementService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

jest.mock('@/lib/api/core/fetchWrappers');

describe('EvenementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllEvenements appelle fetchApi sans filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ description: 'Cérémonie' }]);
    const result = await EvenementService.getAllEvenements();
    expect(fetchApi).toHaveBeenCalledWith('/evenement/');
    expect(result).toEqual([{ description: 'Cérémonie' }]);
  });

  it('getAllEvenements appelle fetchApi avec filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ description: 'Compétition' }]);
    const filters: EvenementFilters = {
      description: 'Compétition',
      lieuId: 1,
      dateDebut: '2025-09-02',
      dateFin: '2025-09-03',
      page: 2,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'asc',
    };
    await EvenementService.getAllEvenements(filters);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('/evenement/?'),);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('description=Comp%C3%A9tition'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('lieuId=1'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('dateDebut=2025-09-02'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('dateFin=2025-09-03'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortBy=date'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortOrder=asc'));
  });

  it('getAllEvenements gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    await expect(EvenementService.getAllEvenements()).rejects.toThrow('API error');
  });

  it('getEvenementById appelle fetchApi avec l’ID', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce({ description: 'Finale' });
    const result = await EvenementService.getEvenementById(123);
    expect(fetchApi).toHaveBeenCalledWith('/evenement/123/');
    expect(result).toEqual({ description: 'Finale' });
  });

  it('getEvenementById gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('Not found'));
    await expect(EvenementService.getEvenementById(999)).rejects.toThrow('Not found');
  });
});
