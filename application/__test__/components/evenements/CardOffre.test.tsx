import { render, screen, fireEvent } from '@testing-library/react';
import CardOffre from '@/components/evenements/CardOffre';
import { Offre } from '@/type/achat/offre';

const mockOffre: Offre = {
  id: 1,
  libelle: 'Catégorie 1',
  nb_personne: 2,
  montant: 150,
  description: 'Places premium avec vue dégagée'
};

describe('CardOffre', () => {
  it('affiche les informations de l\'offre', () => {
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <CardOffre
        offre={mockOffre}
        remainingTickets={10}
        onReservePlaces={mockReserve}
        onUnReservePlaces={mockUnreserve}
        quantityInCart={0}
      />
    );

    expect(screen.getByText('Catégorie 1')).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('appelle onReservePlaces au clic sur le bouton +', () => {
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <CardOffre
        offre={mockOffre}
        remainingTickets={10}
        onReservePlaces={mockReserve}
        onUnReservePlaces={mockUnreserve}
        quantityInCart={0}
      />
    );

    const addButton = screen.getByRole('button', { name: /plus/i });
    fireEvent.click(addButton);

    expect(mockReserve).toHaveBeenCalled();
  });

  it('appelle onUnReservePlaces au clic sur le bouton -', () => {
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <CardOffre
        offre={mockOffre}
        remainingTickets={10}
        onReservePlaces={mockReserve}
        onUnReservePlaces={mockUnreserve}
        quantityInCart={1}
      />
    );

    const removeButton = screen.getByRole('button', { name: /moins/i });
    fireEvent.click(removeButton);

    expect(mockUnreserve).toHaveBeenCalled();
  });

  it('affiche la quantité dans le panier', () => {
    const mockReserve = jest.fn();
    const mockUnreserve = jest.fn();

    render(
      <CardOffre
        offre={mockOffre}
        remainingTickets={10}
        onReservePlaces={mockReserve}
        onUnReservePlaces={mockUnreserve}
        quantityInCart={3}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
