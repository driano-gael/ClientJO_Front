import { renderHook } from '@testing-library/react';
import { useFilteredEpreuves } from '@/hook/useEpreuveFiltered';
import { EpreuveCardType, EpreuveFilters } from '@/type/evenement/epreuve';

const mockEpreuveCards: EpreuveCardType[] = [
  {
    id: 1,
    discipline: 'Natation',
    lieu: 'Centre Aquatique',
    date: '2024-07-26',
    dateRaw: '2024-07-26T10:00:00Z',
    heure: '10:00',
    tour: 'Finale',
    libelle: 'Finale 100m nage libre',
    genre: 'Hommes',
    icone: '/icons/natation.svg'
  },
  {
    id: 2,
    discipline: 'Athlétisme',
    lieu: 'Stade de France',
    date: '2024-07-27',
    dateRaw: '2024-07-27T20:00:00Z',
    heure: '20:00',
    tour: 'Finale',
    libelle: 'Finale 100m',
    genre: 'Hommes',
    icone: '/icons/athletisme.svg'
  }
];

describe('useFilteredEpreuves', () => {
  it('retourne toutes les épreuves sans filtres', () => {
    const filters: EpreuveFilters = {};
    const { result } = renderHook(() =>
      useFilteredEpreuves(mockEpreuveCards, filters)
    );

    expect(result.current).toHaveLength(2);
    expect(result.current).toEqual(mockEpreuveCards);
  });

  it('filtre les épreuves par libelle', () => {
    const filters: EpreuveFilters = { libelle: 'Natation' };
    const { result } = renderHook(() =>
      useFilteredEpreuves(mockEpreuveCards, filters)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].discipline).toBe('Natation');
  });

  it('recalcule seulement quand les dépendances changent', () => {
    const filters: EpreuveFilters = { libelle: 'Finale' };
    const { result, rerender } = renderHook(
      ({ cards, f }) => useFilteredEpreuves(cards, f),
      {
        initialProps: {
          cards: mockEpreuveCards,
          f: filters
        }
      }
    );

    const firstResult = result.current;

    // Re-render avec les mêmes props
    rerender({ cards: mockEpreuveCards, f: filters });

    // Le résultat devrait être le même objet (mémorisé)
    expect(result.current).toBe(firstResult);
  });

  it('recalcule quand les filtres changent', () => {
    const initialFilters: EpreuveFilters = { libelle: 'Natation' };
    const { result, rerender } = renderHook(
      ({ f }) => useFilteredEpreuves(mockEpreuveCards, f),
      { initialProps: { f: initialFilters } }
    );

    expect(result.current).toHaveLength(1);

    // Changer les filtres
    const newFilters: EpreuveFilters = { libelle: 'Athlétisme' };
    rerender({ f: newFilters });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].discipline).toBe('Athlétisme');
  });
});
