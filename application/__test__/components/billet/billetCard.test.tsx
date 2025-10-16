import { render, screen, fireEvent } from '@testing-library/react';
import BilletCard from '@/components/billet/billetCard';
import { Ticket } from '@/type/achat/ticket';

const mockValidTicket: Ticket = {
  id: 1,
  client: {
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie.dupont@email.com',
    telephone: '0123456789'
  },
  evenement: {
    id: 1,
    description: 'Finale 100m hommes',
    lieu: {
      id: 1,
      nom: 'Stade de France'
    },
    date: '2024-08-02T20:00:00Z',
    horraire: '20:00:00',
    nb_place_restante: 100,
    nb_place_total: 80000,
    epreuves: []
  },
  offre: {
    id: 1,
    libelle: 'Catégorie 1',
    nb_personne: 2,
    montant: 300.00,
    description: 'Places premium avec vue dégagée'
  },
  statut: 'valide'
};

const mockInvalidTicket: Ticket = {
  ...mockValidTicket,
  id: 2,
  statut: 'invalide',
  evenement: {
    ...mockValidTicket.evenement,
    description: 'Qualification natation'
  }
};

describe('BilletCard', () => {
  it('affiche les informations du ticket valide', () => {
    render(<BilletCard ticket={mockValidTicket} type="valide" />);

    expect(screen.getByText('Dupont - Marie')).toBeInTheDocument();
    expect(screen.getByText('Finale 100m hommes')).toBeInTheDocument();
    expect(screen.getByText(/Catégorie 1/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/300/)).toBeInTheDocument();
  });

  it('applique le style vert pour un ticket valide', () => {
    render(<BilletCard ticket={mockValidTicket} type="valide" />);

    const card = screen.getByText('Finale 100m hommes').closest('div');
    expect(card).toHaveClass('bg-green-50');

    expect(screen.getByText('Billet Valide')).toBeInTheDocument();
  });

  it('applique le style rouge pour un ticket invalide', () => {
    render(<BilletCard ticket={mockInvalidTicket} type="invalide" />);

    const card = screen.getByText('Qualification natation').closest('div');
    expect(card).toHaveClass('bg-red-50');

    expect(screen.getByText('Billet Non Valide')).toBeInTheDocument();
  });

  it('affiche le bouton QR Code', () => {
    render(<BilletCard ticket={mockValidTicket} type="valide" />);

    const qrButton = screen.getByRole('button', { name: /QrCode/i });
    expect(qrButton).toBeInTheDocument();
  });

  it('ouvre le modal QR Code au clic', () => {
    render(<BilletCard ticket={mockValidTicket} type="valide" />);

    const qrButton = screen.getByRole('button', { name: /QrCode/i });
    fireEvent.click(qrButton);

    // Vérifier que le modal s'ouvre avec le spinner de chargement
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });
});
