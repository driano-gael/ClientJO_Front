/**
 * @module components/header/Profile
 * Module de composant Profile pour la gestion du profil utilisateur et du panier
 *
 * Ce module contient le composant Profile qui gère l'authentification utilisateur,
 * l'affichage du statut de connexion, et l'accès au panier d'achat. Il intègre
 * un système de modal pour la connexion et un menu déroulant pour les utilisateurs connectés.
 *
 * ## Fonctionnalités principales
 * - Bouton de connexion/profil avec icône distinctive
 * - Modal d'authentification pour utilisateurs non connectés
 * - Menu déroulant pour utilisateurs authentifiés
 * - Badge panier avec compteur d'articles en temps réel
 * - Intégration Redux pour la gestion du panier
 * - Gestion des états d'authentification avec useAuth
 *
 * ## Gestion d'authentification
 * - **Non connecté** : Clic ouvre le modal de connexion
 * - **Connecté** : Clic ouvre le menu déroulant d'options
 * - Hook useAuth pour vérifier le statut et gérer la déconnexion
 * - Modal ModalAuthentication intégré pour inscription/connexion
 *
 * ## Fonctionnalités panier
 * - Sélecteur Redux pour récupérer les articles du panier
 * - Calcul automatique du nombre total d'offres dans le panier
 * - Badge rouge avec compteur visible uniquement si connecté et panier non vide
 * - Positionnement absolu en coin supérieur droit de l'icône
 *
 * ## Interface utilisateur
 * - Icône de profil (50x50px) avec hover states
 * - Badge panier rouge avec background red-600
 * - Menu déroulant positionné en absolu (top-14, right-0)
 * - Z-index élevé (1500) pour overlay correct
 * - Design arrondi avec ombre portée pour le menu
 *
 * ## Navigation et actions
 * - Liens vers pages utilisateur (Mes billets, Panier, etc.)
 * - Bouton de déconnexion avec fonction logout
 * - Fermeture automatique du menu lors d'actions
 * - Navigation SPA avec Next.js Link
 *
 * ## Intégration
 * - Utilisé dans HeaderDesktop et HeaderMobile
 * - Compatible avec le système d'authentification global
 * - Intégré avec Redux store pour le panier
 * - Compatible avec le modal d'authentification
 *
 * @group Components
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import ModalAuthentication from '../connexion/modalAuthentication';
import {useAuth} from "@/context/userContext";
import { useSelector } from 'react-redux';
import { OffrePanier } from '@/type/achat/offrePanier';
import Link from "next/link";

/**
 * Composant Profile pour la gestion du profil utilisateur et du panier.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant gère intelligemment l'affichage selon l'état d'authentification :
 * modal de connexion pour les visiteurs, menu déroulant pour les utilisateurs connectés.
 * Il intègre un badge panier dynamique et une navigation contextuelle.
 *
 * @returns Bouton profil avec modal d'auth ou menu déroulant selon le statut utilisateur
 *
 * @example
 * ```tsx
 * // Utilisation dans un header
 * import Profile from '@/components/header/Profile';
 *
 * function Header() {
 *   return (
 *     <nav>
 *       <div>Logo</div>
 *       <div>Navigation</div>
 *       <Profile />
 *     </nav>
 *   );
 * }
 *
 * // Dans HeaderMobile et HeaderDesktop
 * <div className="flex justify-between">
 *   <MenuBurger />
 *   <Logo />
 *   <Profile />
 * </div>
 *
 * // Avec Redux Provider pour le panier
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <AuthProvider>
 *         <Header />
 *       </AuthProvider>
 *     </Provider>
 *   );
 * }
 * ```
 */
export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Récupérer le panier depuis Redux
  const panierItems = useSelector((state: { panier: { items: OffrePanier[] } }) => state.panier.items);
  // Calculer le nombre total d'offres dans le panier
  const cartItemsCount = panierItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      setShowOptions(!showOptions)
    }
  }


  return (

    <div className="relative flex flex-1 items-center justify-end">
      <button className="relative" onClick={() => handleProfileClick()}>
            <Image
              src="/images/icone_connexion.png"
              alt="profil"
              width={50}
              height={50}
            />
        {/* Badge panier si connecté */}
        {isAuthenticated && cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs">
            {cartItemsCount}
          </span>
        )}
      </button>
      {showModal && <ModalAuthentication onCloseAction={() => setShowModal(false)}/>}

      {/* Sous-menu si connecté */}
      {isAuthenticated && showOptions && (
        <div className="absolute right-0 top-14 w-48 rounded-xl border bg-white shadow-lg z-[1500]">
          <ul className="flex flex-col text-sm">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
            <Link href="/panier">
              🛒 Panier
            </Link>
            </li>

            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
              <Link href="/billets">
                📦 Mes billets
              </Link>
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              onClick={logout}
            >
              🚪 Déconnexion
            </li>
          </ul>
        </div>
      )}
    </div>

  )};