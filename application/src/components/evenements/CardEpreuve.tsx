/**
 * @module components/evenements/CardEpreuve
 * Module de composant CardEpreuve pour l'affichage des cartes d'épreuves olympiques
 *
 * Ce module contient le composant CardEpreuve qui affiche une carte visuelle représentant
 * une épreuve olympique. Il présente les informations essentielles de manière compacte
 * et interactive, permettant aux utilisateurs de visualiser et sélectionner des épreuves.
 *
 * ## Fonctionnalités principales
 * - Affichage compact des informations d'épreuve
 * - Design arrondi avec ombre portée pour l'élégance
 * - Interaction au clic pour sélection d'épreuve
 * - Animation de survol avec transition fluide
 * - Layout responsive avec icône et détails
 * - Hiérarchie visuelle claire des informations
 *
 * ## Informations affichées
 * - **Date** : Date de l'épreuve formatée
 * - **Discipline** : Sport concerné (Basketball, Natation, etc.)
 * - **Icône** : Représentation visuelle de la discipline
 * - **Libellé** : Nom spécifique de l'épreuve
 * - **Genre** : Hommes, Femmes, ou Mixte
 * - **Tour** : Phase de la compétition (Finale, Demi-finale, etc.)
 *
 * ## Design et UX
 * - Coins arrondis asymétriques (top-left, bottom-right)
 * - Ombre portée pour profondeur visuelle
 * - Hover effect avec transition shadow
 * - Layout en deux sections : date + détails de l'épreuve
 * - Utilisation des couleurs de base de l'application
 *
 * ## Intégration
 * - Utilisé dans les listes et carousels d'épreuves
 * - Compatible avec les systèmes de filtrage
 * - Intégré avec les modals de détails d'événements
 *
 * @group Components
 */

"use client";

import Image from "next/image";
import { EpreuveCardType } from "@/type/evenement/epreuve";

/**
 * Props du composant CardEpreuve
 */
type Props = {
  /** Données de l'épreuve à afficher dans la carte */
  epreuve: EpreuveCardType;
  /** Fonction appelée lors du clic sur la carte, recevant l'ID de l'épreuve */
  onClick: (id: number) => void;
};

/**
 * Composant CardEpreuve pour l'affichage des cartes d'épreuves olympiques.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant affiche une carte interactive présentant les informations essentielles
 * d'une épreuve olympique avec un design élégant et des interactions fluides.
 * Il organise visuellement les données pour une lecture rapide et intuitive.
 *
 * @param props - Les propriétés du composant
 * @param props.epreuve - Données complètes de l'épreuve à afficher
 * @param props.onClick - Callback appelé avec l'ID lors du clic sur la carte
 *
 * @returns Carte d'épreuve interactive avec informations formatées
 *
 * @example
 * ```tsx
 * // Utilisation dans une liste d'épreuves
 * <CardEpreuve
 *   epreuve={{
 *     id: 1,
 *     date: "2024-07-26",
 *     discipline: { nom: "Basketball", icone: "🏀" },
 *     libelle: "Finale Hommes",
 *     genre: "Hommes",
 *     tour: "Finale"
 *   }}
 *   onClick={(id) => setSelectedEpreuve(id)}
 * />
 *
 * // Dans un carrousel d'épreuves
 * {epreuves.map(epreuve => (
 *   <CardEpreuve
 *     key={epreuve.id}
 *     epreuve={epreuve}
 *     onClick={handleEpreuveSelect}
 *   />
 * ))}
 * ```
 */
export default function CardEpreuve({epreuve, onClick}: Props) {

    return (
        {/* Container principal avec design arrondi et interactions */}
        <div
            className="text-black bg-base-100 w-full flex flex-col px-[1%] align-center items-center my-1 rounded-tl-[20px] rounded-br-[20px] cursor-pointer hover:shadow-lg transition-shadow duration-200"
            style={{boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)"}}
            onClick={() => onClick(epreuve.id)}
        >
            {/* Section date avec séparateur */}
            <div className="font-bold text-center mt-1">
                <p className="text-[80%] pt-[1%]">{epreuve.date}</p>
                <hr className="w-[90%] mx-auto border-[0.1%]"/>
            </div>

            {/* Section principale de l'événement */}
            <div className="w-[90%] mx-auto bg-base-300 border border-base-300 rounded-[20px] mt-[10px] p-1">
                {/* Titre de la discipline */}
                <div className="text-center mb-1 mt-1">
                  <b>{epreuve.discipline}</b>
                </div>

                {/* Layout icône + détails */}
                <div className="flex items-stretch mb-[1%] h-[70px]">
                      {/* Icône de la discipline */}
                      <div className="w-[30%] flex justify-center">
                            <Image
                              src={epreuve.icone}
                              alt={epreuve.discipline}
                              width={30}
                              height={30}
                            />
                      </div>

                      {/* Détails de l'épreuve */}
                      <div className="flex flex-col w-[70%] items-center justify-center text-center text-[80%]">
                          <div>{epreuve.libelle}</div>
                          <div>{epreuve.genre}</div>
                      </div>
                </div>

                {/* Phase/Tour de la compétition */}
                <div className="text-[80%] text-center pb-[1%]">
                    <b>{epreuve.tour}</b>
                </div>
            </div>

            {/* Section lieu et heure */}
            <div className="text-center text-[80%] mt-[1%] mb-[5%]">
                <div>{epreuve.lieu}</div>
                <div>{epreuve.heure}</div>
            </div>

        </div>
    );
}
