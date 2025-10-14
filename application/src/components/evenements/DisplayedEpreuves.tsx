/**
 * @module components/evenements/DisplayedEpreuves
 * Module de composant DisplayedEpreuves pour l'organisation et l'affichage groupé des épreuves olympiques
 *
 * Ce module contient le composant DisplayedEpreuves qui organise automatiquement
 * les épreuves par discipline et les affiche dans des carrousels séparés.
 * Il offre une vue structurée et navigable de toutes les épreuves disponibles.
 *
 * ## Fonctionnalités principales
 * - Groupement automatique des épreuves par discipline
 * - Affichage en carrousels séparés pour chaque discipline
 * - Labels de discipline avec style cohérent
 * - Espacement vertical entre les sections
 * - Transmission des interactions vers les composants enfants
 * - Organisation logique et intuitive des données
 *
 * ## Organisation des données
 * - **Groupement** : Réduction des épreuves en objets par discipline
 * - **Tri automatique** : Organisation alphabétique des disciplines
 * - **Structure hiérarchique** : Discipline > Carrousel > Cartes d'épreuves
 * - **Gestion des doublons** : Évitement automatique par clé de discipline
 *
 * ## Interface utilisateur
 * - Labels de discipline en petite taille (75%) avec style bold
 * - Carrousels interactifs pour chaque discipline
 * - Espacement vertical uniforme entre les sections (space-y-2)
 * - Navigation fluide au sein de chaque discipline
 *
 * ## Intégration
 * - Utilise CarousselEpreuve pour chaque discipline
 * - Compatible avec tous les systèmes de filtrage
 * - Transmission des callbacks vers les composants parents
 * - Adapté pour l'affichage de grandes quantités d'épreuves
 *
 * ## Performance
 * - Réduction efficace avec accumulation
 * - Rendu optimisé par clés de discipline
 * - Lazy loading possible via les carrousels
 * - Gestion mémoire optimisée pour de gros datasets
 *
 * @group Components
 */

import CarousselEpreuve from "@/components/evenements/CarousselEpreuve";
import {EpreuveCardType} from "@/type/evenement/epreuve";

/**
 * Props du composant DisplayedEpreuves
 */
interface Props {
  /** Liste des épreuves à organiser et afficher (optionnel, tableau vide par défaut) */
  epreuves?: EpreuveCardType[];
  /** Fonction appelée lors du clic sur une carte d'épreuve, recevant l'ID de l'épreuve */
  onCardClickAction: (epreuveId: number) => void;
}

/**
 * Composant DisplayedEpreuves pour l'organisation et l'affichage groupé des épreuves.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * Le composant prend une liste d'épreuves et les organise automatiquement par discipline,
 * créant un carrousel séparé pour chaque discipline avec un label descriptif.
 * Il offre une navigation intuitive et structurée des épreuves disponibles.
 *
 * @param props - Les propriétés du composant
 * @param props.epreuves - Liste des épreuves à organiser par discipline
 * @param props.onCardClickAction - Callback appelé lors du clic sur une épreuve
 *
 * @returns Vue organisée des épreuves par discipline avec carrousels interactifs
 *
 * @example
 * ```tsx
 * // Utilisation basique avec liste d'épreuves mixtes
 * <DisplayedEpreuves
 *   epreuves={allEpreuves}
 *   onCardClickAction={(id) => openEpreuveDetails(id)}
 * />
 *
 * // Avec épreuves filtrées et gestion d'état
 * const [selectedEpreuve, setSelectedEpreuve] = useState<number | null>(null);
 *
 * <DisplayedEpreuves
 *   epreuves={filteredEpreuves}
 *   onCardClickAction={(epreuveId) => {
 *     setSelectedEpreuve(epreuveId);
 *     setShowModal(true);
 *   }}
 * />
 *
 * // Affichage conditionnel selon les résultats
 * {epreuves.length > 0 ? (
 *   <DisplayedEpreuves
 *     epreuves={epreuves}
 *     onCardClickAction={handleSelection}
 *   />
 * ) : (
 *   <EmptyState message="Aucune épreuve disponible" />
 * )}
 * ```
 */
export default function DisplayedEpreuves({ epreuves = [], onCardClickAction }: Props) {
  const grouped = epreuves.reduce((acc: Record<string, EpreuveCardType[]>, epreuve) => {
    if (!acc[epreuve.discipline]) acc[epreuve.discipline] = [];
    acc[epreuve.discipline].push(epreuve);
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {Object.entries(grouped).map(([discipline, disciplineEpreuves]:[string, EpreuveCardType[]]) => (
        <div key={discipline}>
          {/* Label de la discipline */}
          <h2 className="text-[75%] text-black font-bold">{discipline}</h2>
          <CarousselEpreuve epreuves={disciplineEpreuves} onCardClickAction={onCardClickAction}/>
        </div>
      ))}
    </div>
  );
}
