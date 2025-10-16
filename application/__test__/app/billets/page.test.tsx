import { render, screen } from '@testing-library/react';
import Billet from '@/app/billets/page';
import * as useTicketsModule from '@/hook/useTickets';
import { Ticket } from '@/type/achat/ticket';

// Mock des composants
jest.mock('@/components/header/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('@/components/billet/billetCard', () => {
  return function MockBilletCard({ ticket, type }: any) {
    return (
      <div data-testid={`billet-${ticket.id}`} data-type={type}>
        Billet {ticket.id}
      </div>
    );
  };
});

const mockTickets: Ticket[] = [
  {
    id: 1,
    statut: 'valide',
    evenement: {
      id: 1,
      description: 'Finale 100m',
      date: '2024-08-01',
      horraire: '14:00:00',
      nb_place_restante: 100,
      lieu: {
        id: 1,
        nom: 'Stade de Paris'
      },
      epreuves: [],
      nb_place_total: 80000
    },
    offre: {
      id: 1,
      libelle: 'Solo',
      nb_personne: 1,
      montant: 50,
      description: 'Test'
    },
    client: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@test.com',
      telephone: '0123456789'
    }
  },
  {
    id: 2,
    statut: 'invalide',
    evenement: {
      id: 2,
      description: 'Natation',
      date: '2024-08-02',
      horraire: '10:00:00',
      nb_place_restante: 50,
      lieu: {
        id: 2,
        nom: 'Centre aquatique Paris'
      },
      epreuves: [],
      nb_place_total: 5000
    },
    offre: {
      id: 2,
      libelle: 'Duo',
      nb_personne: 2,
      montant: 100,
      description: 'Test'
    },
    client: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@test.com',
      telephone: '0123456789'
    }
  }
];

describe('Billet Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche la page des billets', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: mockTickets,
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText(/Billets valides/i)).toBeInTheDocument();
    expect(screen.getByText(/Billets non valides/i)).toBeInTheDocument();
  });

  it('affiche les billets valides', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: mockTickets,
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByTestId('billet-1')).toBeInTheDocument();
    expect(screen.getByTestId('billet-1')).toHaveAttribute('data-type', 'valide');
  });

  it('affiche les billets invalides', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: mockTickets,
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByTestId('billet-2')).toBeInTheDocument();
    expect(screen.getByTestId('billet-2')).toHaveAttribute('data-type', 'invalide');
  });

  it('affiche un message si aucun billet valide', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: [mockTickets[1]], // Seulement un billet invalide
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByText(/Aucun billet valide/i)).toBeInTheDocument();
  });

  it('affiche un message si aucun billet invalide', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: [mockTickets[0]], // Seulement un billet valide
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByText(/Aucun billet non valide/i)).toBeInTheDocument();
  });

  it('gère l\'absence de billets', () => {
    jest.spyOn(useTicketsModule, 'useTickets').mockReturnValue({
      tickets: [],
      loading: false,
      error: null
    });

    render(<Billet />);

    expect(screen.getByText(/Aucun billet valide/i)).toBeInTheDocument();
    expect(screen.getByText(/Aucun billet non valide/i)).toBeInTheDocument();
  });
});
