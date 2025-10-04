import { Evenement } from '@/type/evenement/evenement';
import { Lieu } from '@/type/evenement/lieu';
import { Epreuve } from '@/type/evenement/epreuve';

describe('Evenement type', () => {
  it('devrait avoir les propriétés attendues', () => {
    const lieu: Lieu = { id: 1, nom: 'Stade' };
    const epreuves: Epreuve[] = [];
    const evenement: Evenement = {
      id: 1,
      description: 'Finale',
      lieu,
      date: '2025-09-02',
      horraire: '10:00',
      epreuves,
      nb_place_total: 1000,
      nb_place_restante: 500,
    };
    expect(evenement.id).toBe(1);
    expect(evenement.description).toBe('Finale');
    expect(evenement.lieu).toEqual(lieu);
    expect(evenement.date).toBe('2025-09-02');
    expect(evenement.horraire).toBe('10:00');
    expect(evenement.epreuves).toEqual(epreuves);
    expect(evenement.nb_place_total).toBe(1000);
    expect(evenement.nb_place_restante).toBe(500);
  });
});
