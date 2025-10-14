/**
 * @module components/connexion/SessionExpiredModal
 * Module de composant SessionExpiredModal pour la gestion des sessions expirées
 *
 * Ce module contient le composant SessionExpiredModal qui informe l'utilisateur
 * de l'expiration de sa session et gère la redirection automatique vers la page
 * de connexion. Il offre une interface utilisateur claire avec compte à rebours.
 *
 * ## Fonctionnalités principales
 * - Modal d'information sur l'expiration de session
 * - Compte à rebours automatique de 10 secondes
 * - Redirection automatique vers la connexion
 * - Possibilité de fermeture manuelle
 * - Possibilité de reconnexion immédiate
 * - Interface centrée avec overlay semi-transparent
 *
 * ## Comportement automatique
 * - Affichage conditionnel basé sur la prop isOpen
 * - Décompte de 10 secondes vers 0
 * - Redirection automatique à la fin du décompte
 * - Réinitialisation du compteur à la fermeture
 *
 * ## Actions utilisateur
 * - **Fermer** : Ferme le modal sans redirection
 * - **Se reconnecter maintenant** : Redirection immédiate
 * - **Attendre** : Redirection automatique après décompte
 *
 * ## Intégration
 * - Utilisé lors de la détection d'expiration de token JWT
 * - Intégré dans le système d'authentification global
 * - Compatible avec les intercepteurs HTTP d'authentification
 *
 * @group Components
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Props du composant SessionExpiredModal
 */
interface Props {
  /** Contrôle l'affichage du modal (true = visible, false = masqué) */
  isOpen: boolean;
  /** Fonction appelée quand l'utilisateur ferme le modal manuellement */
  onClose: () => void;
  /** Fonction appelée pour rediriger vers la page de connexion */
  onReconnect: () => void;
}

/**
 * Composant SessionExpiredModal pour la gestion des sessions expirées.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant affiche un modal informatif lorsque la session utilisateur expire,
 * avec un compte à rebours automatique et des options de gestion pour l'utilisateur.
 * Il gère automatiquement la redirection après expiration du délai.
 *
 * @param props - Les propriétés du composant
 * @param props.isOpen - État d'affichage du modal
 * @param props.onClose - Callback de fermeture manuelle
 * @param props.onReconnect - Callback de redirection vers connexion
 *
 * @returns Modal de session expirée avec compte à rebours ou null si fermé
 *
 * @example
 * ```tsx
 * // Utilisation dans un contexte d'authentification
 * const [sessionExpired, setSessionExpired] = useState(false);
 *
 * <SessionExpiredModal
 *   isOpen={sessionExpired}
 *   onClose={() => setSessionExpired(false)}
 *   onReconnect={() => router.push('/login')}
 * />
 *
 * // Avec gestion des intercepteurs HTTP
 * useEffect(() => {
 *   const interceptor = axios.interceptors.response.use(
 *     response => response,
 *     error => {
 *       if (error.response?.status === 401) {
 *         setSessionExpired(true);
 *       }
 *       return Promise.reject(error);
 *     }
 *   );
 * }, []);
 * ```
 */
export default function SessionExpiredModal({ isOpen, onClose, onReconnect }: Props) {
    
    /**
     * État pour le compte à rebours en secondes.
     * Initialisé à 10 secondes et décrémenté chaque seconde.
     */
    const [countdown, setCountdown] = useState(10);
    
    /**
     * Effect pour gérer le compte à rebours automatique et la redirection.
     *
     * Comportement :
     * - Réinitialise le compteur à 10 quand le modal se ferme
     * - Lance un interval d'1 seconde quand le modal s'ouvre
     * - Décrémente le compteur chaque seconde
     * - Déclenche la redirection quand le compteur atteint 0
     * - Nettoie l'interval lors du démontage ou fermeture
     */
    useEffect(() => {
        if (!isOpen) {
            setCountdown(10);
            return;
        }
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    onReconnect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, onReconnect]);

    /** Retourne null si le modal n'est pas ouvert (pas de rendu) */
    if (!isOpen) return null;

    return (
        // Overlay semi-transparent plein écran avec z-index élevé
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Container modal centré avec design responsive */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
                {/* Icône visuelle d'horloge */}
                <div className="text-6xl mb-4">⏰</div>

                {/* Titre principal du modal */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Session expirée
                </h2>

                {/* Message informatif avec compte à rebours dynamique */}
                <p className="text-gray-600 mb-6">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion dans {countdown} secondes.
                </p>

                {/* Boutons d'action pour l'utilisateur */}
                <div className="flex justify-center space-x-3">
                    {/* Bouton de fermeture manuelle */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Fermer
                    </button>

                    {/* Bouton de reconnexion immédiate */}
                    <button
                        onClick={onReconnect}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Se reconnecter maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}
