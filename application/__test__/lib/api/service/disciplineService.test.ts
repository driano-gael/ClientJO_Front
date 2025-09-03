import { DisciplineService, DisciplineFilters } from '@/lib/api/service/disciplineService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

jest.mock('@/lib/api/core/fetchWrappers');

describe('DisciplineService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllDisciplines appelle fetchApi sans filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ nom: 'Athlétisme' }]);
    const result = await DisciplineService.getAllDisciplines();
    expect(fetchApi).toHaveBeenCalledWith('/discipline/');
    expect(result).toEqual([{ nom: 'Athlétisme' }]);
  });

  it('getAllDisciplines appelle fetchApi avec filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ nom: 'Natation' }]);
    const filters: DisciplineFilters = { nom: 'Natation', page: 2, limit: 10, sortBy: 'nom', sortOrder: 'asc' };
    await DisciplineService.getAllDisciplines(filters);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('/discipline/?'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('search=Natation'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortBy=nom'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortOrder=asc'));
  });

  it('getAllDisciplines gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    await expect(DisciplineService.getAllDisciplines()).rejects.toThrow('API error');
  });

  it('getDisciplineById appelle fetchApi avec l’ID', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce({ nom: 'Boxe' });
    const result = await DisciplineService.getDisciplineById(123);
    expect(fetchApi).toHaveBeenCalledWith('/discipline/123/');
    expect(result).toEqual({ nom: 'Boxe' });
  });

  it('getDisciplineById gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('Not found'));
    await expect(DisciplineService.getDisciplineById(999)).rejects.toThrow('Not found');
  });
});
