/**
 * Formate une date en français avec le jour de la semaine, le jour et le mois
 * @param dateString - La date au format string (optionnel)
 * @returns La date formatée en français ou "Date Inconnue" si non fournie
 * @example
 * formatDateFr("2024-07-26") // "vendredi 26 juillet"
 */
export function formatDateFr(dateString?: string): string {
  if (!dateString) return "Date Inconnue";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date Inconnue";
    return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(date);
  } catch {
    return "Date Inconnue";
  }
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

  try {
    const parts = heure.split(":");
    if (parts.length !== 2) return "Horaire inconnu";

    const [h, m] = parts;
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);

    if (isNaN(hours) || isNaN(minutes)) return "Horaire inconnu";

    return `${hours}h${m}`;
  } catch {
    return "Horaire inconnu";
  }
}