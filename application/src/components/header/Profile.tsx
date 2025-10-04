'use client';

import { useState } from 'react';
import Image from 'next/image';
import ModalAuthentication from '../connexion/modalAuthentication';
import {useAuth} from "@/context/userContext";
import { useSelector } from 'react-redux';
import { OffrePanier } from '@/type/achat/offrePanier';
import Link from "next/link";

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