export function formatDateFr(dateString?: string): string {
  if (!dateString) return "Date Inconnue";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function formatHeure(heure?: string): string {
  if (!heure) return "Horaire inconnu";
  const [h, m] = heure.split(":");
  return `${parseInt(h, 10)}h${m}`;
}