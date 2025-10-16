import { formatDateFr, formatHeure } from '@/utils/formatDate';

describe('formatDate utils', () => {
  describe('formatDateFr', () => {
    it('formate une date ISO en format français avec jour de la semaine', () => {
      const result = formatDateFr('2024-08-02T20:30:00Z');
      expect(result).toContain('2 août'); // Vérifie que la date contient le bon jour et mois
    });

    it('gère les dates avec timezone', () => {
      const result = formatDateFr('2024-12-25T15:45:30+01:00');
      expect(result).toContain('25 décembre');
    });

    it('gère les erreurs de format', () => {
      const result = formatDateFr('invalid-date');
      expect(result).toBe('Date Inconnue');
    });

    it('gère les dates nulles ou undefined', () => {
      expect(formatDateFr(undefined)).toBe('Date Inconnue');
      expect(formatDateFr('')).toBe('Date Inconnue');
    });
  });

  describe('formatHeure', () => {
    it('formate une heure au format français', () => {
      const result = formatHeure('20:30');
      expect(result).toBe('20h30');
    });

    it('gère les heures avec minutes à zéro', () => {
      const result = formatHeure('14:00');
      expect(result).toBe('14h00');
    });

    it('gère les heures de matin avec zéro initial', () => {
      const result = formatHeure('09:15');
      expect(result).toBe('9h15');
    });

    it('gère les erreurs de format pour l\'heure', () => {
      const result = formatHeure('invalid-time');
      expect(result).toBe('Horaire inconnu');
    });

    it('gère les valeurs undefined', () => {
      const result = formatHeure(undefined);
      expect(result).toBe('Horaire inconnu');
    });

    it('gère les valeurs vides', () => {
      const result = formatHeure('');
      expect(result).toBe('Horaire inconnu');
    });
  });
});
