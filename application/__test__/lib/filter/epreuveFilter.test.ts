import { filterEpreuves } from '@/lib/filter/epreuveFilter';
import { EpreuveCardType, EpreuveFilters } from '@/type/evenement/epreuve';

const mockEpreuves: EpreuveCardType[] = [
  {
    id: 1,
    discipline: 'Athlétisme',
    lieu: 'Stade de France',
    date: '2024-08-02',
    dateRaw: '2024-08-02T20:00:00Z',
    heure: '20:00',
    tour: 'Finale',
    libelle: 'Finale 100m hommes',
    genre: 'Hommes',
    icone: '/icons/athletisme.png'
  },
  {
    id: 2,
    discipline: 'Natation',
    lieu: 'Centre Aquatique',
    date: '2024-07-30',
    dateRaw: '2024-07-30T10:00:00Z',
    heure: '10:00',
    tour: 'Qualification',
    libelle: 'Qualification 200m nage libre',
    genre: 'Hommes',
    icone: '/icons/natation.png'
  },
  {
    id: 3,
    discipline: 'Athlétisme',
    lieu: 'Stade de France',
    date: '2024-08-03',
    dateRaw: '2024-08-03T19:30:00Z',
    heure: '19:30',
    tour: 'Demi-finale',
    libelle: 'Demi-finale saut en longueur',
    genre: 'Hommes',
    icone: '/icons/athletisme.png'
  },
  {
    id: 4,
    discipline: 'Gymnastique',
    lieu: 'Arena Bercy',
    date: '2024-08-01',
    dateRaw: '2024-08-01T16:00:00Z',
    heure: '16:00',
    tour: 'Finale',
    libelle: 'Finale gymnastique artistique',
    genre: 'Femmes',
    icone: '/icons/gymnastique.png'
  }
];

describe('epreuveFilter', () => {
  describe('filterEpreuves', () => {
    it('retourne toutes les épreuves sans filtres', () => {
      const filters: EpreuveFilters = {};
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(4);
      expect(result).toEqual(mockEpreuves);
    });

    it('filtre par libelle/discipline', () => {
      const filters: EpreuveFilters = { libelle: 'Natation' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(1);
      expect(result[0].discipline).toBe('Natation');
    });

    it('filtre par libelle exact', () => {
      const filters: EpreuveFilters = { libelle: 'Finale 100m hommes' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(1);
      expect(result[0].libelle).toBe('Finale 100m hommes');
    });

    it('filtre par date (dateRaw)', () => {
      const filters: EpreuveFilters = { date: '2024-08-02' };
      const result = filterEpreuves(mockEpreuves, filters);

      // Le filtre de date utilise >= donc inclut 2024-08-02 et 2024-08-03
      expect(result.length).toBeGreaterThan(0);
    });

    it('filtre par tour', () => {
      const filters: EpreuveFilters = { tour: 'Finale' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(2);
      expect(result.every(e => e.tour === 'Finale')).toBe(true);
    });

    it('filtre par disciplineId avec fullEpreuves', () => {
      const fullEpreuves = [
        {
          id: 1,
          libelle: 'Finale 100m hommes',
          discipline: { id: 1, nom: 'Athlétisme', icone: '/icons/athletisme.png' },
          lieu: { id: 1, nom: 'Stade de France' },
          date: '2024-08-02T20:00:00Z',
          tour: 'Finale',
          genre: 'Hommes'
        },
        {
          id: 2,
          libelle: 'Qualification 200m nage libre',
          discipline: { id: 2, nom: 'Natation', icone: '/icons/natation.png' },
          lieu: { id: 2, nom: 'Centre Aquatique' },
          date: '2024-07-30T10:00:00Z',
          tour: 'Qualification',
          genre: 'Hommes'
        }
      ];

      const filters: EpreuveFilters = { disciplineId: 1 };
      const result = filterEpreuves(mockEpreuves, filters, fullEpreuves);

      expect(result).toHaveLength(1);
      expect(result[0].discipline).toBe('Athlétisme');
    });

    it('trie par date en ordre croissant', () => {
      const filters: EpreuveFilters = { sortBy: 'date', sortOrder: 'asc' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result[0].date).toBe('2024-07-30');
      expect(result[result.length - 1].date).toBe('2024-08-03');
    });

    it('trie par date en ordre décroissant', () => {
      const filters: EpreuveFilters = { sortBy: 'date', sortOrder: 'desc' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result[0].date).toBe('2024-08-03');
      expect(result[result.length - 1].date).toBe('2024-07-30');
    });

    it('trie par libelle en ordre croissant', () => {
      const filters: EpreuveFilters = { sortBy: 'libelle', sortOrder: 'asc' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result[0].libelle).toBe('Demi-finale saut en longueur');
    });

    it('trie par libelle en ordre décroissant', () => {
      const filters: EpreuveFilters = { sortBy: 'libelle', sortOrder: 'desc' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result[0].libelle).toBe('Qualification 200m nage libre');
    });

    it('combine plusieurs filtres', () => {
      const filters: EpreuveFilters = {
        libelle: 'Athlétisme',
        tour: 'Finale'
      };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(1);
      expect(result[0].libelle).toBe('Finale 100m hommes');
    });

    it('retourne un tableau vide si aucune correspondance', () => {
      const filters: EpreuveFilters = { libelle: 'inexistant' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toEqual([]);
    });

    it('gère les filtres avec des valeurs vides', () => {
      const filters: EpreuveFilters = { libelle: '' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(4);
    });

    it('est insensible à la casse', () => {
      const filters: EpreuveFilters = { libelle: 'NATATION' };
      const result = filterEpreuves(mockEpreuves, filters);

      expect(result).toHaveLength(1);
      expect(result[0].discipline).toBe('Natation');
    });

    it('filtre les épreuves sans dateRaw quand on filtre par date', () => {
      const epreuveSansDate: EpreuveCardType = {
        id: 5,
        discipline: 'Test',
        lieu: 'Test',
        date: '2024-08-01',
        dateRaw: '',
        heure: '10:00',
        tour: 'Test',
        libelle: 'Test',
        genre: 'Hommes',
        icone: '/icons/test.png'
      };
      const epreuvesAvecSansDate = [...mockEpreuves, epreuveSansDate];
      const filters: EpreuveFilters = { date: '2024-08-01' };
      const result = filterEpreuves(epreuvesAvecSansDate, filters);

      expect(result.every(e => e.dateRaw)).toBe(true);
    });
  });
});
