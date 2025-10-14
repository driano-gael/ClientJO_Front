/**
 * @module components/evenements/CarousselEpreuve
 * Module de composant CarousselEpreuve pour l'affichage en carrousel des épreuves olympiques
 *
 * Ce module contient le composant CarousselEpreuve qui affiche une liste d'épreuves
 * sous forme de carrousel interactif avec navigation par boutons et gestes tactiles.
 * Il s'adapte automatiquement à la taille d'écran pour optimiser l'affichage.
 *
 * ## Fonctionnalités principales
 * - Affichage en carrousel responsive avec calcul dynamique du nombre de cartes
 * - Navigation par boutons précédent/suivant
 * - Support des gestes tactiles (swipe) pour appareils mobiles
 * - Animation fluide entre les slides avec transitions CSS
 * - Boucle infinie pour navigation continue
 * - Redimensionnement automatique selon la largeur d'écran
 *
 * ## Navigation
 * - **Boutons** : Flèches gauche/droite avec overlay semi-transparent
 * - **Tactile** : Swipe gauche/droite avec détection de distance minimale (50px)
 * - **Boucle** : Retour automatique au début/fin lors des limites
 * - **Keyboard** : Compatible avec la navigation clavier (focus)
 *
 * ## Responsive Design
 * - Calcul automatique : largeur écran ÷ 250px = nombre de cartes visibles
 * - Redimensionnement en temps réel sur resize de fenêtre
 * - Réinitialisation de position lors du changement de taille
 * - Adaptation mobile/desktop automatique
 *
 * ## Interactions
 * - Clic sur carte : transmission de l'ID d'épreuve au parent
 * - Swipe tactile : détection de mouvement avec seuil de 50px
 * - Hover effects sur les boutons de navigation
 * - Transitions fluides de 500ms entre les slides
 *
 * ## Design et UX
 * - Coins arrondis asymétriques (top-left, bottom-right)
 * - Boutons de navigation positionnés en dehors du carrousel
 * - Padding interne pour espacement des cartes
 * - Overflow masqué pour effet de glissement propre
 *
 * @group Components
 */

"use client";

import {useState, useEffect} from "react";
import { EpreuveCardType } from "@/type/evenement/epreuve";
import CardEpreuve from "@/components/evenements/CardEpreuve";

/**
 * Props du composant CarousselEpreuve
 */
interface Props {
  /** Liste des épreuves à afficher dans le carrousel (optionnel, tableau vide par défaut) */
  epreuves?: EpreuveCardType[];
  /** Fonction appelée lors du clic sur une carte d'épreuve, recevant l'ID de l'épreuve */
  onCardClickAction: (epreuveId: number) => void;
}

/**
 * Composant CarousselEpreuve pour l'affichage en carrousel des épreuves olympiques.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant crée un carrousel interactif qui s'adapte automatiquement à la taille
 * d'écran et offre plusieurs modes de navigation. Il calcule dynamiquement le nombre
 * de cartes visibles et gère les transitions fluides entre les slides.
 *
 * @param props - Les propriétés du composant
 * @param props.epreuves - Liste des épreuves à afficher dans le carrousel
 * @param props.onCardClickAction - Callback appelé lors du clic sur une carte
 *
 * @returns Carrousel interactif avec navigation et gestion tactile
 *
 * @example
 * ```tsx
 * // Utilisation basique avec liste d'épreuves
 * <CarousselEpreuve
 *   epreuves={epreuvesData}
 *   onCardClickAction={(id) => setSelectedEpreuve(id)}
 * />
 *
 * // Avec gestion d'état et modal
 * const [selectedEpreuve, setSelectedEpreuve] = useState<number | null>(null);
 *
 * <CarousselEpreuve
 *   epreuves={filteredEpreuves}
 *   onCardClickAction={(epreuveId) => {
 *     setSelectedEpreuve(epreuveId);
 *     setModalOpen(true);
 *   }}
 * />
 *
 * // Carrousel vide (affichage conditionnel)
 * <CarousselEpreuve
 *   epreuves={[]}
 *   onCardClickAction={handleEpreuveSelection}
 * />
 * ```
 */
export default function CarousselEpreuve({ epreuves = [], onCardClickAction }: Props) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(2);
  const [startX, setStartX] = useState<number | null>(null);


  // Calcul dynamique du nombre de cartes visibles
  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      setVisible(Math.ceil(width / 250));
      setCurrent(0);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [epreuves]);

  const cardWidth = 100 / visible;

  // Navigation boutons
  const nextSlide = () => {
    if (current + visible >= epreuves.length) {
      setCurrent(0);
    } else {
      setCurrent(current + 1);
    }
  };

  const prevSlide = () => {
    if (current === 0) {
      setCurrent(epreuves.length - visible);
    } else {
      setCurrent(current - 1);
    }
  };

  // Swipe tactile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const diff = startX - e.touches[0].clientX;
    if (diff > 50) {
      nextSlide();
      setStartX(null);
    } else if (diff < -50) {
      prevSlide();
      setStartX(null);
    }
  };

  return (
    <div className="relative w-full overflow-visible">
      <div className="overflow-hidden bg-base-300 rounded-tl-[20px] rounded-br-[20px]">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${current * cardWidth}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {epreuves.map((epreuve, index) => (
            <div
              key={index}
              style={{
                flex: `0 0 ${cardWidth}%`,
                maxWidth: `${cardWidth}%`,
                boxSizing: "border-box",
                padding: "0.5rem",
              }}
            >
              <CardEpreuve epreuve={epreuve} onCardClickAction={onCardClickAction}/>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        style={{ left: "-15px" }}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
        style={{ right: "-15px" }}
      >
        ›
      </button>
    </div>
  );
}
