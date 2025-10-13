/**
 * Page des événements et épreuves des Jeux Olympiques de Paris 2024
 *
 * Cette page constitue le cœur de l'application de billetterie, permettant aux utilisateurs
 * de découvrir, filtrer et sélectionner les épreuves olympiques pour lesquelles ils souhaitent
 * réserver des billets.
 *
 * ## Structure de la page
 * - **Header** : Navigation principale avec authentification
 * - **CarousselEpreuve** : Carrousel des épreuves à la une
 * - **SearchEpreuve** : Interface de recherche et filtrage
 * - **DisplayedEpreuves** : Grille d'affichage des épreuves filtrées
 * - **ModalEvenement** : Modal de détails et réservation
 *
 * ## Fonctionnalités principales
 * - Affichage de toutes les épreuves olympiques disponibles
 * - Système de filtrage avancé (discipline, date, tour, etc.)
 * - Recherche textuelle dans les épreuves
 * - Carrousel interactif des épreuves populaires
 * - Modal de réservation avec gestion du panier
 *
 * ## Gestion d'état
 * - **useEpreuves** : Chargement des épreuves depuis l'API
 * - **useFilteredEpreuves** : Filtrage en temps réel des résultats
 * - États locaux pour les filtres et la modal
 * - Gestion des erreurs avec notifications
 *
 * ## Interactions utilisateur
 * - Filtrage en temps réel des épreuves
 * - Sélection d'épreuves pour voir les détails
 * - Ajout au panier depuis la modal
 * - Navigation fluide entre les épreuves
 *
 * ## Performance
 * - Filtrage optimisé avec mémorisation
 * - Chargement asynchrone des données
 * - Affichage de spinners pendant les chargements
 *
 * @module app/evenements/page
 * @group Pages
 */

'use client';
import Header from "@/components/header/Header";
import CarousselEpreuve from "@/components/evenements/CarousselEpreuve";
import SearchEpreuve from "@/components/evenements/searchEpreuve";
import DisplayedEpreuves from "@/components/evenements/DisplayedEpreuves";
import {useEpreuves} from "@/hook/useEpreuve";
import Spinner from "@/components/common/Spinner";
import Notification from "@/components/common/Notification";
import {EpreuveCardType, EpreuveFilters} from "@/type/evenement/epreuve";
import {mapEpreuveToCard} from "@/lib/api/service/epreuveService";
import ModalEvenement from "@/components/evenements/ModalEvenement";
import {useFilteredEpreuves} from "@/hook/useEpreuveFiltered";
import {useState} from "react";

/**
 * Page des événements et épreuves olympiques.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @returns Page complète de navigation et sélection des épreuves
 */
export default function Evenements() {
  const {epreuves, loading, error} = useEpreuves()
  const [filters, setFilters] = useState<EpreuveFilters>({});
  const epreuveCards: EpreuveCardType[] = epreuves.map(mapEpreuveToCard);
  const [currentEpreuveId, setCurrentEpreuveId] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const filteredEpreuveCards = useFilteredEpreuves(epreuveCards, filters, epreuves)


  // Tri des 10 prochaines épreuves par date la plus récente
const epreuvesCarrousel = [...epreuveCards]
  .sort((a, b) => new Date(a.dateRaw).getTime() - new Date(b.dateRaw).getTime()) // a - b pour croissant
  .slice(0, 10);

  // Fonction pour mettre à jour les filtres
  const handleFiltersChange = (newFilters: EpreuveFilters) => {
    setFilters(newFilters);
  };

  const handleClickCard = (id: number) => {
    setCurrentEpreuveId(id);
    setIsModalOpen(true)
    console.log("modal open")
  }
  const handleOnCloseModal= ()=>setIsModalOpen(false)

  return (
    <>
      <Header/>
      {isModalOpen && <ModalEvenement epreuveId={currentEpreuveId} onCloseAction={handleOnCloseModal}/>}
      <div className="bg-base-200">
        <div className="w-[90%] mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center text-black min-h-[300px]">
              <Spinner size={"large"}/>
              <p>Chargement des évènements...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Notification message={error.message} type={"error"}/>
            </div>
          )}
          <div className="pt-4 pb-4">
            <SearchEpreuve
              onFiltersChange={handleFiltersChange}
              filters={filters}
              epreuves={epreuves}
            />
          </div>

          <div>
            <p className="font-extrabold text-black">A VENIR</p>
            <hr className="border-1 border-black"/>
            <div className="my-1">
              <CarousselEpreuve epreuves={epreuvesCarrousel} onCardClickAction={handleClickCard}/>
            </div>
          </div>

          <div>
            <p className="font-extrabold text-black">TOUT LES EVENEMENTS</p>
            <hr className="border-1 border-black"/>
            <DisplayedEpreuves epreuves={filteredEpreuveCards} onCardClickAction={handleClickCard}/>
          </div>
        </div>
      </div>

    </>
  );
}