import { Discipline } from '@/type/evenement/discipline';

describe('Discipline type', () => {
  it('devrait avoir les propriétés id et nom', () => {
    const discipline: Discipline = { id: 1, nom: 'Athlétisme' };
    expect(discipline.id).toBe(1);
    expect(discipline.nom).toBe('Athlétisme');
  });
});
