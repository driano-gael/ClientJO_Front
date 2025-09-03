import { Lieu } from '@/type/evenement/lieu';

describe('Lieu type', () => {
  it('devrait avoir les propriétés attendues', () => {
    const lieu: Lieu = { id: 1, nom: 'Stade' };
    expect(lieu.id).toBe(1);
    expect(lieu.nom).toBe('Stade');
  });
});

