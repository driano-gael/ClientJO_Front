/**
 * Formate une date en français avec le jour de la semaine, le jour et le mois
 * @param dateString - La date au format string (optionnel)
 * @returns La date formatée en français ou "Date Inconnue" si non fournie
 * @example
 * formatDateFr("2024-07-26") // "vendredi 26 juillet"
 */
export function formatDateFr(dateString?: string): string {
  if (!dateString) return "Date Inconnue";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

/**
 * Formate une heure au format français (ex: 14h30)
 * @param heure - L'heure au format HH:MM (optionnel)
 * @returns L'heure formatée ou "Horaire inconnu" si non fournie
 * @example
 * formatHeure("14:30") // "14h30"
 */
export function formatHeure(heure?: string): string {
  if (!heure) return "Horaire inconnu";
  const [h, m] = heure.split(":");
  return `${parseInt(h, 10)}h${m}`;
}