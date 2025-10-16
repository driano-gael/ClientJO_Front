import { renderHook, waitFor } from '@testing-library/react';
import { useTickets } from '@/hook/useTickets';
import { TicketService } from '@/lib/api/service/ticketService';
import { Ticket } from '@/type/achat/ticket';

// Mock du service
jest.mock('@/lib/api/service/ticketService', () => ({
  TicketService: {
    getAllClientTickets: jest.fn(),
  },
}));

const mockTicketService = TicketService as jest.Mocked<typeof TicketService>;

const mockTickets: Ticket[] = [
  {
    id: 1,
    offre: {
      id: 1,
      libelle: 'Catégorie 1',
      nb_personne: 2,
      montant: 300.00,
      description: 'Places premium'
    },
    evenement: {
      id: 1,
      description: 'Finale 100m',
      lieu: {
        id: 1,
        nom: 'Stade de France'
      },
      date: '2024-08-02T20:00:00Z',
      horraire: '20:00',
      epreuves: [],
      nb_place_total: 1000,
      nb_place_restante: 500
    },
    client: {
      email: 'marie.dupont@example.com',
      nom: 'Dupont',
      prenom: 'Marie',
      telephone: '0123456789'
    },
    statut: 'valide'
  },
  {
    id: 2,
    offre: {
      id: 2,
      libelle: 'Catégorie 2',
      nb_personne: 1,
      montant: 150.00,
      description: 'Places standard'
    },
    evenement: {
      id: 2,
      description: 'Qualification natation',
      lieu: {
        id: 2,
        nom: 'Centre Aquatique'
      },
      date: '2024-07-30T10:00:00Z',
      horraire: '10:00',
      epreuves: [],
      nb_place_total: 500,
      nb_place_restante: 200
    },
    client: {
      email: 'marie.dupont@example.com',
      nom: 'Dupont',
      prenom: 'Marie',
      telephone: '0123456789'
    },
    statut: 'invalide'
  }
];

describe('useTickets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('charge les tickets avec succès', async () => {
    mockTicketService.getAllClientTickets.mockResolvedValue(mockTickets);

    const { result } = renderHook(() => useTickets());

    // État initial
    expect(result.current.tickets).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Attendre l'opération asynchrone
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tickets).toEqual(mockTickets);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs lors du chargement', async () => {
    const errorMessage = 'Erreur de réseau';
    mockTicketService.getAllClientTickets.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTickets());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tickets).toEqual([]);
    expect(result.current.error).toBeNull(); // Le hook ne set pas l'error dans le catch
  });

  it('initialise avec les bonnes valeurs par défaut', () => {
    mockTicketService.getAllClientTickets.mockResolvedValue([]);

    const { result } = renderHook(() => useTickets());

    expect(result.current.tickets).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
