import { TicketService } from '@/lib/api/service/ticketService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

// Mock fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('TicketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllClientTickets', () => {
    it('appelle fetchApi pour récupérer tous les tickets du client', async () => {
      const mockTickets = [
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Marie',
          valid: true,
          id_evenement: 1,
          description_evenement: 'Finale 100m',
          lieu: 'Stade de France',
          date_evenement: '2024-08-02T20:00:00Z',
          libelle_offre: 'Catégorie 1',
          nb_personnes: 2,
          montant: 300,
          description_offre: 'Places premium'
        },
        {
          id: 2,
          nom: 'Dupont',
          prenom: 'Marie',
          valid: false,
          id_evenement: 2,
          description_evenement: 'Qualification natation',
          lieu: 'Centre Aquatique',
          date_evenement: '2024-07-30T10:00:00Z',
          libelle_offre: 'Catégorie 2',
          nb_personnes: 1,
          montant: 150,
          description_offre: 'Places standard'
        }
      ];

      mockFetchApi.mockResolvedValue(mockTickets);

      const result = await TicketService.getAllClientTickets();

      expect(mockFetchApi).toHaveBeenCalledWith('/ticket-client/', {}, true);
      expect(result).toEqual(mockTickets);
    });

    it('gère les erreurs de fetchApi', async () => {
      const error = new Error('Erreur lors du chargement des tickets');
      mockFetchApi.mockRejectedValue(error);

      await expect(TicketService.getAllClientTickets()).rejects.toThrow('Erreur lors du chargement des tickets');
    });
  });

  describe('getClientTicket', () => {
    it('appelle fetchApi avec l\'ID du ticket', async () => {
      const mockTicket = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Marie',
        valid: true,
        id_evenement: 1,
        description_evenement: 'Finale 100m',
        lieu: 'Stade de France',
        date_evenement: '2024-08-02T20:00:00Z',
        libelle_offre: 'Catégorie 1',
        nb_personnes: 2,
        montant: 300,
        description_offre: 'Places premium'
      };

      mockFetchApi.mockResolvedValue(mockTicket);

      const result = await TicketService.getClientTicket(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/ticket-client/1/', {}, true);
      expect(result).toEqual(mockTicket);
    });

    it('gère les erreurs de fetchApi pour un ticket spécifique', async () => {
      const error = new Error('Ticket non trouvé');
      mockFetchApi.mockRejectedValue(error);

      await expect(TicketService.getClientTicket(999)).rejects.toThrow('Ticket non trouvé');
    });
  });
});
