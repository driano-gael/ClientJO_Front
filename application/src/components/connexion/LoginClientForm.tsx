/**
 * @module components/connexion/LoginClientForm
 * Module de composant LoginClientForm pour l'authentification des utilisateurs
 *
 * Ce module contient le composant LoginClientForm qui gère le processus de connexion
 * des utilisateurs de l'application. Il offre une interface de saisie sécurisée avec
 * validation, gestion d'erreurs et intégration avec le système d'authentification global.
 *
 * ## Fonctionnalités principales
 * - Formulaire de connexion avec validation
 * - Intégration avec le contexte d'authentification
 * - Gestion des états de chargement et d'erreur
 * - Protection contre les soumissions multiples
 * - Notifications d'erreur avec composant dédié
 * - Redirection vers l'inscription
 *
 * ## Champs du formulaire
 * - **Email** : Validation automatique du format email
 * - **Mot de passe** : Champ sécurisé avec autocomplétion
 *
 * ## Gestion des erreurs
 * - Affichage des erreurs via le composant Notification
 * - Messages d'erreur contextuels depuis l'API
 * - Gestion des timeouts et états de chargement
 *
 * ## Intégration
 * - Utilise le contexte UserContext pour l'authentification
 * - Callback de succès personnalisable
 * - Navigation vers formulaire d'inscription
 *
 * @group Components
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/context/userContext';
import Notification from '../common/Notification';
import Spinner from '../common/Spinner';

/**
 * Props du composant LoginClientForm
 */
type Props = {
  /** Fonction appelée pour basculer vers le formulaire d'inscription */
  onClick: () => void;
  /** Fonction optionnelle appelée après une connexion réussie */
  onLoginSuccess?: () => void;
}

/**
 * Composant LoginClientForm pour la connexion des utilisateurs.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant gère complètement le processus de connexion avec validation des champs,
 * gestion des erreurs, protection contre les soumissions multiples et intégration
 * avec le système d'authentification global via le contexte.
 *
 * @param props - Les propriétés du composant
 * @param props.onClick - Fonction pour basculer vers le formulaire d'inscription
 * @param props.onLoginSuccess - Callback optionnel exécuté après connexion réussie
 *
 * @returns Formulaire de connexion avec gestion complète des états
 *
 * @example
 * ```tsx
 * // Utilisation basique
 * <LoginClientForm
 *   onClick={() => setShowRegister(true)}
 * />
 *
 * // Avec callback de succès
 * <LoginClientForm
 *   onClick={() => setShowRegister(true)}
 *   onLoginSuccess={() => router.push('/dashboard')}
 * />
 * ```
 */
export default function LoginClientForm({onClick, onLoginSuccess}: Props) {
  /** État de l'email saisi par l'utilisateur */
  const [email, setEmail] = useState('');

  /** État du mot de passe saisi par l'utilisateur */
  const [password, setPassword] = useState('');

  /** Message d'erreur à afficher à l'utilisateur */
  const [error, setError] = useState<string | null>(null);

  /** État d'affichage de la notification d'erreur */
  const [showNotification, setShowNotification] = useState(false);

  /** État de chargement pendant la soumission du formulaire */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Référence du timeout pour empêcher les soumissions multiples.
   * Protège contre les clics rapides successifs sur le bouton de connexion.
   */
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** Fonction de connexion issue du contexte d'authentification */
  const { login } = useAuth();

  /**
   * Gestionnaire de fermeture de la notification d'erreur.
   * Utilise requestAnimationFrame pour une fermeture fluide et useCallback pour l'optimisation.
   *
   * @returns void
   */
  const handleCloseNotification = useCallback(() => {
    requestAnimationFrame(() => {
      setShowNotification(false);
      setError(null);
    });
  }, []);

  /**
   * Gestionnaire de soumission du formulaire de connexion.
   *
   * Gère le processus complet de connexion :
   * - Validation et protection contre les soumissions multiples
   * - Appel à l'API d'authentification via le contexte
   * - Gestion des états de chargement et d'erreur
   * - Exécution du callback de succès si fourni
   *
   * @param e - Événement de soumission du formulaire
   * @returns Promise<void>
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Protection contre les soumissions multiples
    if (submitTimeoutRef.current || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    // Timeout de protection de 1 seconde
    submitTimeoutRef.current = setTimeout(() => {
      submitTimeoutRef.current = null;
    }, 1000);
    
    try {
      // Connexion via le contexte d'authentification
      await login(email, password, false);

      // Exécution différée du callback de succès
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }
    } catch (err: unknown) {
      // Gestion des erreurs avec message contextuel
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, onLoginSuccess, isLoading]);

  return (
    <>
      <div className='flex flex-col items-center justify-between p-[10%]  h-full'>
        <h2 className="text-3xl font-bold text-black mt-3">CONNEXION</h2>
        <form onSubmit={handleSubmit} className="gap-4 p-4 flex items-center flex-col w-full">
          {/* Champ email avec validation automatique */}
          <div className="w-full flex flex-col mb-2">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
              className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
            />
          </div>

          {/* Champ mot de passe sécurisé */}
          <div className="w-full flex flex-col mb-2">
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              required
              className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
            />
          </div>

          {/* Bouton de soumission avec état de chargement */}
          <button
            type="submit" 
            disabled={isLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[140px] ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <Spinner size="small" color="white" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Lien vers l'inscription */}
        <div className='flex justify-center items-center gap-2 mt-4 mb-6 text-black'>
          <span>Pas encore de compte?</span>
          <button onClick={onClick}
            className="font-bold underline"
          >
            S&apos;inscrire
          </button>
        </div>
      </div>

      {/* Notification d'erreur conditionnelle */}
      {showNotification && error && (
        <Notification 
          message={error} 
          type="error" 
          onCloseAction={handleCloseNotification}
        />
      )}
    </>
  );
}
