import { LieuService, LieuFilters } from '@/lib/api/service/lieuService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

jest.mock('@/lib/api/core/fetchWrappers');

describe('LieuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllLieux appelle fetchApi sans filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ nom: 'Stade' }]);
    const result = await LieuService.getAllLieux();
    expect(fetchApi).toHaveBeenCalledWith('/lieu/');
    expect(result).toEqual([{ nom: 'Stade' }]);
  });

  it('getAllLieux appelle fetchApi avec filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ nom: 'Piscine' }]);
    const filters: LieuFilters = { nom: 'Piscine', page: 2, limit: 10 };
    await LieuService.getAllLieux(filters);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('/lieu/?'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('search=Piscine'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
  });

  it('getAllLieux gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    await expect(LieuService.getAllLieux()).rejects.toThrow('API error');
  });
});

