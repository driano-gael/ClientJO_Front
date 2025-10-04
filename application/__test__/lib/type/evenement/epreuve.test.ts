import {Epreuve, EpreuveCardType} from '@/type/evenement/epreuve';
import {Discipline} from '@/type/evenement/discipline';
import {Evenement} from '@/type/evenement/evenement';

describe('Epreuve type', () => {
  it('devrait avoir les propriétés attendues', () => {
    const discipline: Discipline = {id: 1, nom: 'Athlétisme', icone: 'ath.svg'};
    const evenement: Evenement = {
      id: 1,
      description: 'Finale',
      date: '2025-09-02',
      lieu: {id: 1, nom: 'Stade'},
      horraire: '', // valeur de test
      epreuves: [], // tableau vide pour la propriété epreuves
      nb_place_total: 1000,
      nb_place_restante: 500
    };
    const epreuve: Epreuve = {
      id: 10,
      libelle: '100m',
      discipline,
      evenement,
      genre: 'Homme',
      tour: 'final',
    };
    expect(epreuve.id).toBe(10);
    expect(epreuve.libelle).toBe('100m');
    expect(epreuve.discipline).toEqual(discipline);
    expect(epreuve.evenement).toEqual(evenement);
    expect(epreuve.genre).toBe('Homme');
    expect(epreuve.tour).toBe('final');
  });


  describe('EpreuveCardType type', () => {
    it('devrait avoir les propriétés attendues', () => {
      const card: EpreuveCardType = {
        id: 1,
        date: '02/09/2025',
        dateRaw: '2025-09-02',
        discipline: 'Athlétisme',
        genre: 'Homme',
        libelle: '100m',
        tour: 'final',
        lieu: 'Stade',
        heure: '10:00',
        icone: 'ath.svg'
      };
      expect(card.id).toBe(1);
      expect(card.date).toBe('02/09/2025');
      expect(card.dateRaw).toBe('2025-09-02');
      expect(card.discipline).toBe('Athlétisme');
      expect(card.genre).toBe('Homme');
      expect(card.libelle).toBe('100m');
      expect(card.tour).toBe('final');
      expect(card.lieu).toBe('Stade');
      expect(card.heure).toBe('10:00');
      expect(card.icone).toBe('ath.svg');
    });

  });
})
