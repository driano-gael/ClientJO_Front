import { Discipline } from '@/type/evenement/discipline';

describe('Discipline type', () => {
  it('devrait avoir les propriétés id et nom', () => {
    const discipline: Discipline = { id: 1, nom: 'Athlétisme', icone: 'ath.svg' };
    expect(discipline.id).toBe(1);
    expect(discipline.nom).toBe('Athlétisme');
    expect(discipline.icone).toBe('ath.svg');
  });
});
