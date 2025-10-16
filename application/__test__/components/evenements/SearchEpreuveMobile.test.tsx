import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchEpreuveMobile from '@/components/evenements/SearchEpreuveMobile';
import { EpreuveFilters, Epreuve } from '@/type/evenement/epreuve';
import { Discipline } from '@/type/evenement/discipline';

// Mock du hook useDisciplines
jest.mock('@/hook/useDisciplines', () => ({
  useDisciplines: jest.fn()
}));

// Mock de Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  }
}));

const mockDisciplines: Discipline[] = [
  { id: 1, nom: 'Athlétisme', icone: '/icons/athletisme.png' },
  { id: 2, nom: 'Natation', icone: '/icons/natation.png' },
  { id: 3, nom: 'Tennis', icone: '/icons/tennis.png' }
];

const mockEpreuves: Epreuve[] = [
  {
    id: 1,
    libelle: '100m Finale',
    discipline: { id: 1, nom: 'Athlétisme', icone: '/icons/athletisme.png' },
    genre: 'Homme',
    tour: 'Finale'
  },
  {
    id: 2,
    libelle: '200m Finale',
    discipline: { id: 1, nom: 'Athlétisme', icone: '/icons/athletisme.png' },
    genre: 'Homme',
    tour: 'Finale'
  },
  {
    id: 3,
    libelle: '50m Nage libre',
    discipline: { id: 2, nom: 'Natation', icone: '/icons/natation.png' },
    genre: 'Femme',
    tour: 'Finale'
  }
];

describe('SearchEpreuveMobile', () => {
  const mockOnFiltersChange = jest.fn();
  const mockFilters: EpreuveFilters = {};

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    const { useDisciplines } = require('@/hook/useDisciplines');
    useDisciplines.mockReturnValue({
      disciplines: mockDisciplines,
      loading: false,
      error: null
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('affiche le composant avec le header fermé par défaut', () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    expect(screen.getByText('Filtrer')).toBeInTheDocument();
    expect(screen.queryByLabelText('Discipline')).not.toBeInTheDocument();
  });

  it('expand et collapse le formulaire au clic sur le header', () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    const header = screen.getByText('Filtrer').closest('div');

    // Expand
    fireEvent.click(header!);
    expect(screen.getByLabelText('Discipline')).toBeInTheDocument();

    // Collapse
    fireEvent.click(header!);
    expect(screen.queryByLabelText('Discipline')).not.toBeInTheDocument();
  });

  it('affiche la liste de disciplines lors de la recherche', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    // Expand le formulaire
    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    // Attendre le debounce
    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });
  });

  it('sélectionne une discipline et met à jour les filtres', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Athlétisme'));

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      disciplineId: 1
    });
  });

  it('affiche la liste des épreuves filtrées par discipline', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Athlétisme' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      const athletismeOption = screen.getByText('Athlétisme');
      fireEvent.click(athletismeOption);
    });

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('100m Finale')).toBeInTheDocument();
    });
  });

  it('sélectionne une épreuve et met à jour les filtres', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('100m Finale')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('100m Finale'));

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      libelle: '100m Finale'
    });
  });

  it('gère le changement de date', () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const dateInput = screen.getByLabelText('Date minimum');
    fireEvent.change(dateInput, { target: { value: '2024-08-01' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      date: '2024-08-01'
    });
  });

  it('efface tous les filtres', () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={{ disciplineId: 1, libelle: '100m', date: '2024-08-01' }}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const clearButton = screen.getByText('Effacer les filtres');
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  it('ferme la liste de disciplines au clic extérieur', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    // Simuler un clic extérieur
    fireEvent.mouseDown(document.body);

    jest.advanceTimersByTime(10);

    await waitFor(() => {
      expect(screen.queryByText('Athlétisme')).not.toBeInTheDocument();
    });
  });

  it('ferme la liste d\'épreuves au clic extérieur', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('100m Finale')).toBeInTheDocument();
    });

    // Simuler un clic extérieur
    fireEvent.mouseDown(document.body);

    jest.advanceTimersByTime(10);

    await waitFor(() => {
      expect(screen.queryByText('100m Finale')).not.toBeInTheDocument();
    });
  });

  it('réinitialise la discipline lors de la modification du champ de recherche', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');

    // Sélectionner d'abord une discipline
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Athlétisme' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Athlétisme'));
    });

    // Modifier le champ de recherche
    fireEvent.change(disciplineInput, { target: { value: 'Natation' } });

    expect(mockOnFiltersChange).toHaveBeenCalled();
  });

  it('gère le blur sur le champ discipline', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });

    fireEvent.blur(disciplineInput);

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.queryByText('Athlétisme')).not.toBeInTheDocument();
    });
  });

  it('gère le blur sur le champ épreuve', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByText('100m Finale')).toBeInTheDocument();
    });

    fireEvent.blur(epreuveInput);

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.queryByText('100m Finale')).not.toBeInTheDocument();
    });
  });

  it('n\'affiche pas de liste si aucune discipline ne correspond', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.change(disciplineInput, { target: { value: 'XYZ' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.queryByText('Athlétisme')).not.toBeInTheDocument();
      expect(screen.queryByText('Natation')).not.toBeInTheDocument();
    });
  });

  it('n\'affiche pas de liste si aucune épreuve ne correspond', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.change(epreuveInput, { target: { value: 'XYZ Inconnu' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.queryByText('100m Finale')).not.toBeInTheDocument();
    });
  });

  it('gère une date vide', () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={{ date: '2024-08-01' }}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const dateInput = screen.getByLabelText('Date minimum');
    fireEvent.change(dateInput, { target: { value: '' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      date: undefined
    });
  });

  it('empêche le blur lors du mouseDown sur la liste de disciplines', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const disciplineInput = screen.getByLabelText('Discipline');
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      const athletismeOption = screen.getByText('Athlétisme');
      expect(athletismeOption).toBeInTheDocument();

      // MouseDown sur l'option ne devrait pas provoquer de blur
      fireEvent.mouseDown(athletismeOption);
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    });
  });

  it('empêche le blur lors du mouseDown sur la liste d\'épreuves', async () => {
    render(
      <SearchEpreuveMobile
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    fireEvent.click(screen.getByText('Filtrer'));

    const epreuveInput = screen.getByLabelText(/Épreuve/);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      const epreuveOption = screen.getByText('100m Finale');
      expect(epreuveOption).toBeInTheDocument();

      // MouseDown sur l'option ne devrait pas provoquer de blur
      fireEvent.mouseDown(epreuveOption);
      expect(screen.getByText('100m Finale')).toBeInTheDocument();
    });
  });
});

