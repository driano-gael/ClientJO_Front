import { renderHook, waitFor } from '@testing-library/react';
import { useDisciplines } from '@/hook/useDisciplines';
import { DisciplineService } from '@/lib/api/service/disciplineService';

// Mock du service
jest.mock('@/lib/api/service/disciplineService');
const mockDisciplineService = DisciplineService as jest.Mocked<typeof DisciplineService>;

const mockDisciplines = [
  { id: 1, nom: 'Athlétisme', icone: 'athletisme.png' },
  { id: 2, nom: 'Natation', icone: 'natation.png' },
  { id: 3, nom: 'Gymnastique', icone: 'gymnastique.png' },
];

describe('useDisciplines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('charge les disciplines avec succès', async () => {
    mockDisciplineService.getAllDisciplines.mockResolvedValue(mockDisciplines);

    const { result } = renderHook(() => useDisciplines());

    // État initial
    expect(result.current.disciplines).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Attendre l'opération asynchrone
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.disciplines).toEqual(mockDisciplines);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs de chargement', async () => {
    const error = new Error('Erreur réseau');
    mockDisciplineService.getAllDisciplines.mockRejectedValue(error);

    const { result } = renderHook(() => useDisciplines());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.disciplines).toEqual([]);
    expect(result.current.error).toBe(error);
  });

  it('appelle le service une seule fois au montage', async () => {
    mockDisciplineService.getAllDisciplines.mockResolvedValue(mockDisciplines);

    renderHook(() => useDisciplines());

    expect(mockDisciplineService.getAllDisciplines).toHaveBeenCalledTimes(1);
  });
});
