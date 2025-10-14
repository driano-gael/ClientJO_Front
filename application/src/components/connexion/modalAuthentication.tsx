/**
 * @module components/connexion/ModalAuthentication
 * Module de composant ModalAuthentication pour l'affichage modal des formulaires d'authentification
 *
 * Ce module contient le composant ModalAuthentication qui gère l'affichage modal des
 * formulaires de connexion et d'inscription. Il utilise React Portal pour un rendu
 * au-dessus de l'interface principale et offre une navigation fluide entre les deux modes.
 *
 * ## Fonctionnalités principales
 * - Modal centré avec overlay semi-transparent
 * - Basculement entre connexion et inscription
 * - Rendu via React Portal pour isolation DOM
 * - Fermeture par bouton ou callback
 * - Responsive design avec tailles adaptatives
 * - Gestion SSR/CSR avec vérification window
 *
 * ## Modes d'affichage
 * - **Connexion** : Formulaire LoginClientForm (par défaut)
 * - **Inscription** : Formulaire RegisterClientForm
 * - Navigation entre les modes via boutons intégrés
 *
 * ## Intégration
 * - Utilise React Portal vers l'élément #modal-root
 * - Fermeture automatique après connexion réussie
 * - Compatible avec le système de navigation de l'application
 *
 * ## Structure DOM
 * - Overlay fixe plein écran (z-index 100)
 * - Modal centré avec dimensions responsives
 * - Bouton de fermeture en haut à droite
 *
 * @group Components
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginClientForm from './LoginClientForm';
import RegisterClientForm from './RegisterClientForm';
import ReactDOM from "react-dom";

/**
 * Props du composant ModalAuthentication
 */
type Props = {
  /** Fonction appelée lors de la fermeture du modal */
  onCloseAction: () => void;
}

/**
 * Composant ModalAuthentication pour l'affichage modal des formulaires d'authentification.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant gère l'affichage modal des formulaires de connexion et d'inscription
 * avec une navigation fluide entre les deux modes. Il utilise React Portal pour
 * s'afficher au-dessus de l'interface principale sans affecter la hiérarchie DOM.
 *
 * @param props - Les propriétés du composant
 * @param props.onCloseAction - Fonction de fermeture du modal
 *
 * @returns Modal d'authentification avec formulaires intégrés ou null si SSR
 *
 * @example
 * ```tsx
 * // Utilisation basique
 * <ModalAuthentication
 *   onCloseAction={() => setShowModal(false)}
 * />
 *
 * // Avec gestion d'état parent
 * const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 *
 * {isAuthModalOpen && (
 *   <ModalAuthentication
 *     onCloseAction={() => setIsAuthModalOpen(false)}
 *   />
 * )}
 * ```
 */
export default function ModalAuthentication({onCloseAction}: Props) {
  /**
   * État déterminant quel formulaire afficher.
   * true = connexion (LoginClientForm), false = inscription (RegisterClientForm)
   */
  const [isRegister, setIsRegister] = useState(true);

  /** Protection SSR : retourne null côté serveur pour éviter les erreurs d'hydratation */
  if (typeof window === "undefined") return null;

  /**
   * Récupération de l'élément DOM cible pour le portal.
   * Le modal sera rendu dans l'élément #modal-root du DOM principal.
   */
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  /**
   * Gestionnaire de basculement entre les modes connexion/inscription.
   * Inverse l'état isRegister pour changer de formulaire affiché.
   *
   * @returns void
   */
  const toggleOnRegister = () => {
    setIsRegister(!isRegister);
  }

  return ReactDOM.createPortal(
    <>
      {/* Overlay semi-transparent plein écran avec z-index élevé */}
      <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 z-[100]">
        {/* Container modal avec dimensions responsives */}
        <div
          className="relative bg-base-300 m-[2%] rounded-xl w-full max-w-[400px] h-[650px] border"
        >
          {/* Bouton de fermeture positionné en haut à droite */}
          <button
            onClick={onCloseAction}
            className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            <Image 
              src="/images/close-arrow(24).png" 
              alt="Fermer" 
              width={24} 
              height={24}
            />
          </button>

          {/* Affichage conditionnel des formulaires selon l'état */}
          {isRegister
            ? (<LoginClientForm onClick={toggleOnRegister} onLoginSuccess={onCloseAction}/>)
            : (<RegisterClientForm onClick={toggleOnRegister}/>)
          }
        </div>
      </div>
    </>,
    modalRoot
  );
}
