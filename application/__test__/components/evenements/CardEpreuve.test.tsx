import { render, screen, fireEvent } from '@testing-library/react';
import CardEpreuve from '@/components/evenements/CardEpreuve';
import { EpreuveCardType } from '@/type/evenement/epreuve';

const mockEpreuve: EpreuveCardType = {
  id: 1,
  discipline: 'Basketball',
  lieu: 'Stade Pierre Mauroy',
  date: '2024-07-26',
  dateRaw: '2024-07-26T20:00:00Z',
  heure: '20:00',
  tour: 'Finale',
  libelle: 'Finale Hommes Basketball',
  genre: 'Hommes',
  icone: '/icons/basketball.png'
};

describe('CardEpreuve', () => {
  it('affiche les informations de l\'épreuve', () => {
    const mockOnClick = jest.fn();

    render(<CardEpreuve epreuve={mockEpreuve} onCardClickAction={mockOnClick} />);

    expect(screen.getByText('2024-07-26')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Finale Hommes Basketball')).toBeInTheDocument();
  });

  it('appelle onCardClickAction au clic', () => {
    const mockOnClick = jest.fn();

    const { container } = render(<CardEpreuve epreuve={mockEpreuve} onCardClickAction={mockOnClick} />);

    const card = container.querySelector('.cursor-pointer');
    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnClick).toHaveBeenCalledWith(1);
  });
});
