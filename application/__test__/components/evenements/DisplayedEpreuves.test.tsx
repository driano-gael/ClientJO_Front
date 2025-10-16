import { render, screen } from '@testing-library/react';
import DisplayedEpreuves from '@/components/evenements/DisplayedEpreuves';
import { EpreuveCardType } from '@/type/evenement/epreuve';

// Mock du composant enfant
jest.mock('@/components/evenements/CardEpreuve', () => {
  return function MockCardEpreuve({ epreuve }: any) {
    return <div data-testid={`card-${epreuve.id}`}>{epreuve.libelle}</div>;
  };
});

const mockEpreuves: EpreuveCardType[] = [
  {
    id: 1,
    discipline: 'Basketball',
    lieu: 'Stade',
    date: '2024-07-26',
    dateRaw: '2024-07-26T20:00:00Z',
    heure: '20:00',
    tour: 'Finale',
    libelle: 'Finale Basketball',
    genre: 'Hommes',
    icone: '/icons/basketball.png'
  }
];

describe('DisplayedEpreuves', () => {
  it('affiche les épreuves', () => {
    const mockOnClick = jest.fn();

    render(<DisplayedEpreuves epreuves={mockEpreuves} onCardClickAction={mockOnClick} />);

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByText('Finale Basketball')).toBeInTheDocument();
  });

  it('rend un conteneur vide si aucune épreuve', () => {
    const mockOnClick = jest.fn();

    const { container } = render(<DisplayedEpreuves epreuves={[]} onCardClickAction={mockOnClick} />);

    // Le conteneur existe mais est vide
    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
  });
});
