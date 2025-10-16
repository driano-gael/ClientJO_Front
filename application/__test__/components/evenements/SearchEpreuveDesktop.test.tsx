import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchEpreuveDesktop from '@/components/evenements/SearchEpreuveDesktop';
import { Epreuve, EpreuveFilters } from '@/type/evenement/epreuve';
import * as useDisciplinesModule from '@/hook/useDisciplines';

const mockEpreuves: Epreuve[] = [
  {
    id: 1,
    libelle: '100m',
    tour: 'Finale',
    genre: 'Hommes',
    discipline: {
      id: 1,
      nom: 'Athlétisme',
      icone: '/icons/athletisme.svg'
    }
  },
  {
    id: 2,
    libelle: 'Papillon',
    tour: 'Demi-finale',
    genre: 'Femmes',
    discipline: {
      id: 2,
      nom: 'Natation',
      icone: '/icons/natation.svg'
    }
  }
];

const mockDisciplines = [
  { id: 1, nom: 'Athlétisme', icone: '/icons/athletisme.svg' },
  { id: 2, nom: 'Natation', icone: '/icons/natation.svg' }
];

describe('SearchEpreuveDesktop', () => {
  const mockOnFiltersChange = jest.fn();
  const defaultFilters: EpreuveFilters = {
    libelle: '',
    disciplineId: undefined,
    date: ''
  };

  beforeEach(() => {
    jest.spyOn(useDisciplinesModule, 'useDisciplines').mockReturnValue({
      disciplines: mockDisciplines,
      loading: false,
      error: null
    });
    mockOnFiltersChange.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche tous les champs de recherche', () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    expect(screen.getByPlaceholderText(/Toutes disciplines/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Toutes épreuves/i)).toBeInTheDocument();
    const dateInput = document.getElementById('desktop-date');
    expect(dateInput).toBeInTheDocument();
  });

  it('affiche le bouton de réinitialisation', () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    expect(screen.getByRole('button', { name: /Effacer les filtres/i })).toBeInTheDocument();
  });

  it('met à jour le filtre de discipline', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });
    fireEvent.focus(disciplineInput);

    // Le composant utilise un debounce, attendons qu'il se déclenche
    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    }, { timeout: 300 });

    // Cliquer sur la suggestion
    const suggestion = screen.getByText('Athlétisme');
    fireEvent.click(suggestion);

    expect(mockOnFiltersChange).toHaveBeenCalled();
  });

  it('met à jour le filtre d\'épreuve', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const epreuveInput = screen.getByPlaceholderText(/Toutes épreuves/i);
    fireEvent.change(epreuveInput, { target: { value: '100' } });
    fireEvent.focus(epreuveInput);

    // Le composant utilise un debounce
    await waitFor(() => {
      expect(screen.getByText('100m')).toBeInTheDocument();
    }, { timeout: 300 });

    const suggestion = screen.getByText('100m');
    fireEvent.click(suggestion);

    expect(mockOnFiltersChange).toHaveBeenCalled();
  });

  it('met à jour le filtre de date', () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const dateInput = document.getElementById('desktop-date') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-08-01' } });

    // Le composant envoie 'date' au lieu de 'dateMin'
    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2024-08-01' })
    );
  });

  it('réinitialise tous les filtres', () => {
    const filtersWithValues: EpreuveFilters = {
      libelle: '100m',
      disciplineId: 1,
      date: '2024-08-01'
    };

    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={filtersWithValues}
        epreuves={mockEpreuves}
      />
    );

    const resetButton = screen.getByRole('button', { name: /Effacer les filtres/i });
    fireEvent.click(resetButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  it('affiche les suggestions de disciplines lors de la saisie', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  it('affiche toutes les épreuves sans filtrage par discipline', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const epreuveInput = screen.getByPlaceholderText(/Toutes épreuves/i);
    fireEvent.focus(epreuveInput);

    await waitFor(() => {
      expect(screen.getByText('100m')).toBeInTheDocument();
      expect(screen.getByText('Papillon')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  it('ferme la liste des disciplines au blur', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    }, { timeout: 300 });

    fireEvent.blur(disciplineInput);

    await waitFor(() => {
      expect(screen.queryByText('Athlétisme')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('ferme la liste des épreuves au blur', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const epreuveInput = screen.getByPlaceholderText(/Toutes épreuves/i);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    await waitFor(() => {
      expect(screen.getByText('100m')).toBeInTheDocument();
    }, { timeout: 300 });

    fireEvent.blur(epreuveInput);

    await waitFor(() => {
      expect(screen.queryByText('100m')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('empêche le blur lors du mouseDown sur la liste de disciplines', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    await waitFor(() => {
      const athletismeOption = screen.getByText('Athlétisme');
      expect(athletismeOption).toBeInTheDocument();

      // mouseDown sur l'option ne devrait pas provoquer de blur
      fireEvent.mouseDown(athletismeOption);
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  it('empêche le blur lors du mouseDown sur la liste d\'épreuves', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const epreuveInput = screen.getByPlaceholderText(/Toutes épreuves/i);
    fireEvent.focus(epreuveInput);
    fireEvent.change(epreuveInput, { target: { value: '100' } });

    await waitFor(() => {
      const epreuveOption = screen.getByText('100m');
      expect(epreuveOption).toBeInTheDocument();

      fireEvent.mouseDown(epreuveOption);
      expect(screen.getByText('100m')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  it('réinitialise la discipline lors de la modification du champ de recherche', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);

    // Sélectionner d'abord une discipline
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Athlétisme' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Athlétisme'));
    }, { timeout: 300 });

    // Modifier le champ de recherche
    fireEvent.change(disciplineInput, { target: { value: 'Natation' } });

    expect(mockOnFiltersChange).toHaveBeenCalled();
  });

  it('affiche le placeholder contextuel pour les épreuves', async () => {
    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mockEpreuves}
      />
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Athlétisme' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Athlétisme'));
    }, { timeout: 300 });

    const epreuveInput = screen.getByPlaceholderText(/Épreuves Athlétisme/i);
    expect(epreuveInput).toBeInTheDocument();
  });

  it('filtre les épreuves selon la discipline sélectionnée', async () => {
    const mixedEpreuves = [
      ...mockEpreuves,
      {
        id: 3,
        libelle: 'Nage libre',
        tour: 'Finale',
        genre: 'Femmes',
        discipline: {
          id: 2,
          nom: 'Natation',
          icone: '/icons/natation.svg'
        }
      }
    ];

    render(
      <SearchEpreuveDesktop
        onFiltersChange={mockOnFiltersChange}
        filters={defaultFilters}
        epreuves={mixedEpreuves}
      />
    );

    // Sélectionner Athlétisme
    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Athlétisme' } });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Athlétisme'));
    }, { timeout: 300 });

    // Chercher les épreuves
    const epreuveInput = screen.getByPlaceholderText(/Épreuves Athlétisme/i);
    fireEvent.focus(epreuveInput);

    await waitFor(() => {
      expect(screen.getByText('100m')).toBeInTheDocument();
      expect(screen.queryByText('Nage libre')).not.toBeInTheDocument();
    }, { timeout: 300 });
  });

  it('ferme les listes lors du clic extérieur', async () => {
    render(
      <div>
        <SearchEpreuveDesktop
          onFiltersChange={mockOnFiltersChange}
          filters={defaultFilters}
          epreuves={mockEpreuves}
        />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const disciplineInput = screen.getByPlaceholderText(/Toutes disciplines/i);
    fireEvent.focus(disciplineInput);
    fireEvent.change(disciplineInput, { target: { value: 'Ath' } });

    await waitFor(() => {
      expect(screen.getByText('Athlétisme')).toBeInTheDocument();
    }, { timeout: 300 });

    // Clic extérieur
    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByText('Athlétisme')).not.toBeInTheDocument();
    }, { timeout: 100 });
  });
});
