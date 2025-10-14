/**
 * Interface définissant les propriétés d'une notification.
 * Utilisée pour afficher des messages temporaires à l'utilisateur.
 *
 * @interface NotificationProps
 */
export interface NotificationProps {
  /** Le message à afficher dans la notification */
  message: string;
  /** Le type de notification qui détermine l'apparence et l'icône */
  type: "success" | "error" | "info";
  /** Durée d'affichage en millisecondes (optionnel, par défaut géré par le composant) */
  duration?: number;
  /** Fonction callback appelée lors de la fermeture de la notification (optionnel) */
  onCloseAction?: () => void;
}