import { EpreuveService, EpreuveFilters } from '@/lib/api/service/epreuveService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { formatDateFr, formatHeure } from '@/utils/formatDate';
import { Epreuve } from '@/type/evenement/epreuve';

jest.mock('@/lib/api/core/fetchWrappers');
jest.mock('@/utils/formatDate');

describe('EpreuveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllEpreuves appelle fetchApi sans filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ libelle: '100m' }]);
    const result = await EpreuveService.getAllEpreuves();
    expect(fetchApi).toHaveBeenCalledWith('/epreuve/', {}, false);
    expect(result).toEqual([{ libelle: '100m' }]);
  });

  it('getAllEpreuves appelle fetchApi avec filtres', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce([{ libelle: 'Natation' }]);
    const filters: EpreuveFilters = { libelle: 'Natation', disciplineId: 1, date: '2025-09-02', tour: 'final', sortBy: 'nom', sortOrder: 'asc' };
    await EpreuveService.getAllEpreuves(filters);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('/epreuve/?'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('search=Natation'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('disciplineId=1'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('date=2025-09-02'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('tour=final'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortBy=nom'), {}, false);
    expect(fetchApi).toHaveBeenCalledWith(expect.stringContaining('sortOrder=asc'), {}, false);
  });

  it('getAllEpreuves gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    await expect(EpreuveService.getAllEpreuves()).rejects.toThrow('API error');
  });

  it('getEpreuveById appelle fetchApi avec l’ID', async () => {
    (fetchApi as jest.Mock).mockResolvedValueOnce({ libelle: 'Boxe' });
    const result = await EpreuveService.getEpreuveById(123);
    expect(fetchApi).toHaveBeenCalledWith('/epreuve/123/');
    expect(result).toEqual({ libelle: 'Boxe' });
  });

  it('getEpreuveById gère les erreurs de fetchApi', async () => {
    (fetchApi as jest.Mock).mockRejectedValueOnce(new Error('Not found'));
    await expect(EpreuveService.getEpreuveById(999)).rejects.toThrow('Not found');
  });

  it('getAllEvenementsAsCards transforme les épreuves en cartes', async () => {
    const fakeEpreuves: Epreuve[] = [
      {
        libelle: '100m',
        genre: 'Homme',
        tour: 'final',
        discipline: { nom: 'Athlétisme' },
        evenement: { date: '2025-09-02', lieu: { nom: 'Stade' }, horraire: '10:00' },
      } as Epreuve,
    ];
    (fetchApi as jest.Mock).mockResolvedValueOnce(fakeEpreuves);
    (formatDateFr as jest.Mock).mockReturnValue('02/09/2025');
    (formatHeure as jest.Mock).mockReturnValue('10:00');
    const result = await EpreuveService.getAllEvenementsAsCards();
    expect(result[0]).toMatchObject({
      date: '02/09/2025',
      discipline: 'Athlétisme',
      genre: 'Homme',
      libelle: '100m',
      tour: 'final',
      lieu: 'Stade',
      heure: '10:00',
    });
  });
});

