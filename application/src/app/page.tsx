/**
 * Page d'accueil de l'application ClientJO - Jeux Olympiques de Paris 2024
 *
 * Cette page constitue le point d'entrée principal de l'application de billetterie
 * des Jeux Olympiques. Elle présente l'événement et guide les utilisateurs vers
 * la réservation de billets.
 *
 * ## Structure de la page
 * - **Header** : Navigation principale avec authentification
 * - **HomeDescription** : Section de présentation avec call-to-action
 * - **HomePresentation** : Cartes de présentation des différents aspects des JO
 *
 * ## Fonctionnalités
 * - Présentation attractive de l'événement JO Paris 2024
 * - Bouton d'appel à l'action "PRENEZ PLACE" vers /evenements
 * - Interface responsive adaptée à tous les écrans
 * - Design moderne avec sections bien structurées
 *
 * ## Navigation
 * - Point d'entrée depuis la racine de l'application (/)
 * - Redirection vers /evenements pour la réservation
 * - Intégration avec le système d'authentification via Header
 *
 * ## Design
 * - Fond base-200 pour une lecture confortable
 * - Texte noir pour un bon contraste
 * - Layout flexbox en colonne centré verticalement
 * - Sections modulaires pour une maintenance facile
 *
 * @module app/page
 * @group Pages
 */

import Header from "@/components/header/Header";
import HomeDescription from "@/components/home/HomeDescription";
import HomePresentation from "@/components/home/HomePresentation";

/**
 * Composant de la page d'accueil de l'application.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @returns Page d'accueil complète avec header, description et présentation
 */

export default function Home() {
  return (
    <>
      <Header/>
      <section className="flex flex-col justify-center bg-base-200 text-black">
        <HomeDescription />
        <HomePresentation/>
      </section>

    </>
  );
}