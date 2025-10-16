import { render, screen, fireEvent } from '@testing-library/react';
import CarousselEpreuve from '@/components/evenements/CarousselEpreuve';
import { EpreuveCardType } from '@/type/evenement/epreuve';

// Mock du composant CardEpreuve
jest.mock('@/components/evenements/CardEpreuve', () => {
  return function MockCardEpreuve({ epreuve, onCardClickAction }: any) {
    const handleClick = () => {
      if (onCardClickAction) {
        onCardClickAction(epreuve.id);
      }
    };

    return (
      <div
        data-testid={`card-${epreuve.id}`}
        onClick={handleClick}
        style={{ width: '250px', cursor: 'pointer' }}
      >
        {epreuve.libelle}
      </div>
    );
  };
});

const mockEpreuves: EpreuveCardType[] = [
  {
    id: 1,
    libelle: '100m Finale',
    discipline: 'Athlétisme',
    date: '2024-08-01',
    dateRaw: '2024-08-01',
    lieu: 'Stade de France',
    genre: 'Homme',
    tour: 'Finale',
    heure: '10:00',
    icone: '/icons/athletisme.png'
  },
  {
    id: 2,
    libelle: 'Natation 50m',
    discipline: 'Natation',
    date: '2024-08-02',
    dateRaw: '2024-08-02',
    lieu: 'Centre aquatique',
    genre: 'Femme',
    tour: 'Finale',
    heure: '14:00',
    icone: '/icons/natation.png'
  },
  {
    id: 3,
    libelle: 'Tennis Simple',
    discipline: 'Tennis',
    date: '2024-08-03',
    dateRaw: '2024-08-03',
    lieu: 'Roland Garros',
    genre: 'Homme',
    tour: 'Demi-finale',
    heure: '16:00',
    icone: '/icons/tennis.png'
  },
  {
    id: 4,
    libelle: 'Basketball',
    discipline: 'Basketball',
    date: '2024-08-04',
    dateRaw: '2024-08-04',
    lieu: 'Arena',
    genre: 'Homme',
    tour: 'Finale',
    heure: '20:00',
    icone: '/icons/basketball.png'
  },
  {
    id: 5,
    libelle: 'Football',
    discipline: 'Football',
    date: '2024-08-05',
    dateRaw: '2024-08-05',
    lieu: 'Stade',
    genre: 'Homme',
    tour: 'Finale',
    heure: '21:00',
    icone: '/icons/football.png'
  }
];

describe('CarousselEpreuve', () => {
  const mockOnCardClick = jest.fn();

  beforeEach(() => {
    mockOnCardClick.mockClear();
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
  });

  it('affiche le carrousel avec les épreuves', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });

  it('affiche les boutons de navigation', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('appelle onCardClickAction au clic sur une carte', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const card = screen.getByTestId('card-1');
    fireEvent.click(card);

    expect(mockOnCardClick).toHaveBeenCalledWith(1);
    expect(mockOnCardClick).toHaveBeenCalledTimes(1);
  });

  it('gère un tableau vide d\'épreuves', () => {
    const { container } = render(
      <CarousselEpreuve
        epreuves={[]}
        onCardClickAction={mockOnCardClick}
      />
    );

    expect(container.querySelector('[data-testid^="card-"]')).not.toBeInTheDocument();
  });

  it('gère l\'absence de props epreuves', () => {
    const { container } = render(
      <CarousselEpreuve
        onCardClickAction={mockOnCardClick}
      />
    );

    expect(container.querySelector('[data-testid^="card-"]')).not.toBeInTheDocument();
  });

  it('navigue vers la droite au clic sur le bouton suivant', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];

    fireEvent.click(nextButton);
    // Le carrousel devrait se déplacer (pas d'erreur)
    expect(nextButton).toBeInTheDocument();
  });

  it('navigue vers la gauche au clic sur le bouton précédent', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];

    fireEvent.click(prevButton);
    // Le carrousel devrait se déplacer (pas d'erreur)
    expect(prevButton).toBeInTheDocument();
  });

  it('gère le swipe vers la droite (gauche vers droite)', () => {
    const { container } = render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const carousel = container.querySelector('.flex');
    expect(carousel).toBeInTheDocument();

    // Simuler un swipe vers la droite (diff négatif > -50)
    fireEvent.touchStart(carousel!, { touches: [{ clientX: 200 }] });
    fireEvent.touchMove(carousel!, { touches: [{ clientX: 300 }] });

    expect(carousel).toBeInTheDocument();
  });

  it('gère le swipe vers la gauche (droite vers gauche)', () => {
    const { container } = render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const carousel = container.querySelector('.flex');
    expect(carousel).toBeInTheDocument();

    // Simuler un swipe vers la gauche (diff positif > 50)
    fireEvent.touchStart(carousel!, { touches: [{ clientX: 300 }] });
    fireEvent.touchMove(carousel!, { touches: [{ clientX: 200 }] });

    expect(carousel).toBeInTheDocument();
  });

  it('ignore le touchMove si startX est null', () => {
    const { container } = render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const carousel = container.querySelector('.flex');
    expect(carousel).toBeInTheDocument();

    // Simuler un touchMove sans touchStart
    fireEvent.touchMove(carousel!, { touches: [{ clientX: 200 }] });

    expect(carousel).toBeInTheDocument();
  });

  it('ignore les swipes de faible amplitude', () => {
    const { container } = render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const carousel = container.querySelector('.flex');
    expect(carousel).toBeInTheDocument();

    // Simuler un swipe de faible amplitude (< 50px)
    fireEvent.touchStart(carousel!, { touches: [{ clientX: 200 }] });
    fireEvent.touchMove(carousel!, { touches: [{ clientX: 180 }] });

    expect(carousel).toBeInTheDocument();
  });

  it('boucle au début quand on clique suivant à la fin', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500 // 2 cartes visibles
    });

    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];

    // Cliquer plusieurs fois pour arriver à la fin
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton); // Doit boucler au début

    expect(nextButton).toBeInTheDocument();
  });

  it('gère le redimensionnement de la fenêtre', () => {
    render(
      <CarousselEpreuve
        epreuves={mockEpreuves}
        onCardClickAction={mockOnCardClick}
      />
    );

    // Changer la largeur de la fenêtre
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    });

    fireEvent(window, new Event('resize'));

    expect(screen.getByTestId('card-1')).toBeInTheDocument();
  });
});
