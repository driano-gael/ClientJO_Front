/**
 * Page des billets de l'application ClientJO - Visualisation des tickets achetés
 *
 * Cette page permet aux utilisateurs authentifiés de visualiser tous leurs billets
 * achetés pour les Jeux Olympiques, organisés par statut (valides/invalides).
 * Elle offre l'accès aux QR codes pour l'entrée aux événements.
 *
 * ## Structure de la page
 * - **Header** : Navigation principale avec authentification
 * - **Section billets valides** : Billets utilisables avec QR codes
 * - **Section billets invalides** : Billets expirés ou annulés
 * - **Cartes de billets** : Interface détaillée pour chaque ticket
 *
 * ## Fonctionnalités principales
 * - Affichage de tous les billets de l'utilisateur connecté
 * - Séparation claire entre billets valides et invalides
 * - Accès aux QR codes pour validation à l'entrée
 * - Informations complètes sur chaque billet
 * - Interface responsive pour tous les appareils
 *
 * ## Gestion des données
 * - **useTickets hook** : Récupération des tickets depuis l'API
 * - Filtrage automatique par statut (valide/invalide)
 * - Chargement asynchrone avec gestion d'erreurs
 * - Authentification requise pour accéder aux données
 *
 * ## États des billets
 * - **Billets valides** : Fond vert, utilisables pour l'entrée
 * - **Billets invalides** : Fond rouge, expirés ou annulés
 * - QR codes accessibles pour tous les billets
 *
 * ## Interface utilisateur
 * - Design centré et responsive (max-width: 32rem)
 * - Sections clairement séparées par couleur
 * - Messages informatifs si aucun billet
 * - Cartes de billets interactives avec modals QR code
 *
 * ## Sécurité
 * - Accès restreint aux utilisateurs authentifiés
 * - Données personnelles protégées
 * - QR codes générés dynamiquement et sécurisés
 *
 * @module app/billets/page
 * @group Pages
 */

'use client'

import {useTickets} from "@/hook/useTickets";
import BilletCard from "@/components/billet/billetCard";
import Header from "@/components/header/Header";

/**
 * Page des billets pour la visualisation des tickets achetés.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @returns Page complète d'affichage des billets avec statuts
 */
export default function Billet() {
    const {tickets} = useTickets()
    const billetsValides = tickets?.filter(ticket => ticket.statut === "valide");
    const billetsNonValides = tickets?.filter(ticket => ticket.statut === "invalide");

    return (
        <>
            <Header/>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Section Billets Valides */}
                <section>
                    <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Billets valides</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {billetsValides && billetsValides.length > 0 ? (
                            billetsValides.map(ticket => (
                                <BilletCard key={ticket.id} ticket={ticket} type="valide"/>
                            ))
                        ) : (
                            <p className="text-gray-400 italic ml-2">Aucun billet valide.</p>
                        )}
                    </div>
                </section>
                {/* Section Billets Non Valides */}
                <section className="mt-8">
                    <h2 className="text-xl font-bold text-red-700 mb-4 text-center">Billets non valides</h2>
                    <div className="flex flex-col gap-4 items-center">
                        {billetsNonValides && billetsNonValides.length > 0 ? (
                            billetsNonValides.map(ticket => (
                                <BilletCard key={ticket.id} ticket={ticket} type="invalide"/>
                            ))
                        ) : (
                            <p className="text-gray-400 italic ml-2">Aucun billet non valide.</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
