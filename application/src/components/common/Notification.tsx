/**
 * @module components/common/Notification
 * Module de composant Notification pour l'affichage des messages utilisateur
 *
 * Ce module contient le composant Notification qui affiche des messages temporaires
 * à l'utilisateur avec différents types (succès, erreur, info). Il gère automatiquement
 * la fermeture après une durée configurable et offre une interface utilisateur cohérente.
 *
 * ## Fonctionnalités principales
 * - Affichage centré avec overlay modal
 * - Types de notification : error, success, info
 * - Fermeture automatique configurable
 * - Fermeture manuelle via bouton
 * - Animation d'entrée et barre de progression
 * - Spinner intégré pour les redirections
 *
 * ## Types de notification
 * - **error** : Messages d'erreur (rouge)
 * - **success** : Messages de succès (vert)
 * - **info** : Messages d'information (bleu)
 *
 * ## Utilisation courante
 * - Confirmation d'actions utilisateur
 * - Affichage d'erreurs de validation
 * - Messages de redirection
 * - Notifications de statut
 *
 * @group Components
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import Spinner from "@/components/common/Spinner";
import {NotificationProps} from "@/type/common/notification";

/**
 * Composant Notification pour l'affichage de messages temporaires à l'utilisateur.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant se positionne au centre de l'écran avec un z-index élevé et disparaît
 * automatiquement après la durée spécifiée. Il gère différents types visuels selon
 * le contexte (erreur, succès, information).
 *
 * @param props - Les propriétés du composant
 * @param props.message - Le message à afficher à l'utilisateur
 * @param props.type - Le type de notification qui détermine l'apparence ('error' | 'success' | 'info')
 * @param props.onCloseAction - Fonction appelée lors de la fermeture de la notification
 * @param props.duration - Durée d'affichage en millisecondes avant fermeture automatique
 *
 * @returns Notification modale centrée avec message et contrôles de fermeture
 *
 * @example
 * ```tsx
 * // Notification d'erreur
 * <Notification
 *   message="Une erreur est survenue"
 *   type="error"
 *   onCloseAction={() => setShowNotif(false)}
 * />
 *
 * // Notification de succès avec durée personnalisée
 * <Notification
 *   message="Opération réussie"
 *   type="success"
 *   duration={5000}
 *   onCloseAction={handleClose}
 * />
 * ```
 */
export default function Notification({ message, type = 'error', onCloseAction = () => {}, duration = 3000 }: NotificationProps) {
  /**
   * Référence du timer pour la fermeture automatique.
   * Permet d'annuler le timer si le composant est détruit prématurément.
   */
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Gestionnaire de fermeture de la notification.
   * Utilise useCallback pour éviter les re-renders inutiles.
   *
   * @returns void
   */
  const handleClose = useCallback(() => {
    onCloseAction();
  }, [onCloseAction]);

  /**
   * Effect pour gérer la fermeture automatique de la notification.
   * Configure un timer qui appelle onCloseAction après la durée spécifiée.
   * Nettoie automatiquement le timer précédent et lors de la destruction du composant.
   */
  useEffect(() => {
    // Nettoyer le timer précédent
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Créer un nouveau timer
    timerRef.current = setTimeout(() => {
      onCloseAction();
    }, duration);

    // Cleanup à la destruction du composant
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onCloseAction]);

  /**
   * Détermine les styles CSS selon le type de notification.
   * Utilise useCallback pour optimiser les performances.
   *
   * @returns Classes CSS pour le type de notification spécifié
   */
  const getTypeStyles = useCallback(() => {
    switch (type) {
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-red-500 border-red-600';
    }
  }, [type]);

  return (
    <div className={`fixed top-1/2 left-1/2 z-[60] transform -translate-x-1/2 -translate-y-1/2 ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px] animate-slide-in`}>
      {type === 'success' && message.includes('Redirection') && (
        <div className="flex items-center gap-2">
          <Spinner size="small" color="white"/>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-3 text-white hover:text-gray-200 font-bold text-lg"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 ${type === 'error' ? 'bg-red-300' : type === 'success' ? 'bg-green-300' : 'bg-blue-300'} animate-progress${type === 'success' ? ' success' : ''}`}></div>
    </div>
  );
}
