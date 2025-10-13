/**
 * Module de composant BilletCard pour l'affichage des billets des Jeux Olympiques
 *
 * Ce module contient le composant BilletCard qui présente visuellement un ticket d'événement sportif
 * avec toutes les informations essentielles :
 * - Informations du client (nom, prénom)
 * - Détails de l'événement (description, lieu, date)
 * - Informations de l'offre (libellé, nombre de personnes, montant, description)
 * - Statut du billet (valide/invalide) avec codes couleur appropriés
 * - Bouton d'accès au QR code pour validation à l'entrée
 *
 * ## Fonctionnalités principales
 * Le composant adapte automatiquement son apparence selon le statut :
 * - **Billet valide** : fond vert clair avec badge vert
 * - **Billet invalide** : fond rouge clair avec badge rouge
 *
 * ## Interactions utilisateur
 * - Clic sur le bouton "QrCode" ouvre un modal avec le QR code scannable
 * - Interface responsive adaptée aux différentes tailles d'écran
 * - Gestion d'état pour l'ouverture/fermeture du modal QR code
 *
 * ## Logique interne
 * - Calcul automatique des classes CSS selon le statut du billet
 * - Gestion de l'état du modal QR code avec useState
 * - Rendu conditionnel du modal selon l'état d'ouverture
 *
 * @module components/billet/billetCard
 * @group Components
 */

import { Ticket } from "@/type/achat/ticket";
import { useState } from "react";
import QRCodeModal from "@/components/billet/qrCodeModal";

/**
 * Props du composant BilletCard
 */
export type BilletCardProps = {
  /** Ticket à afficher dans la carte */
  ticket: Ticket;
  /** Type du billet - détermine l'apparence visuelle */
  type: "valide" | "invalide";
};

/**
 * Composant BilletCard pour l'affichage des billets des Jeux Olympiques.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @param props - Les propriétés du composant
 * @returns Carte de billet interactive avec modal QR code intégré
 *
 * @example
 * ```tsx
 * // Affichage d'un billet valide
 * <BilletCard
 *   ticket={{
 *     id: 123,
 *     client: { nom: "Dupont", prenom: "Jean" },
 *     evenement: { description: "Finale 100m" },
 *     offre: { libelle: "Catégorie A", nb_personne: 2, montant: 150 }
 *   }}
 *   type="valide"
 * />
 *
 * // Affichage d'un billet invalide
 * <BilletCard ticket={expiredTicket} type="invalide" />
 * ```
 */
export default function BilletCard({ ticket, type }: BilletCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isValide = type === "valide";
  const bgColor = isValide ? "bg-green-50" : "bg-red-50";
  const badgeColor = isValide ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const badgeText = isValide ? "Billet Valide" : "Billet Non Valide";

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={`w-full max-w-md ${bgColor} m-0 p-4 border rounded-lg shadow-md`}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">{ticket.client.nom} - {ticket.client.prenom}</p>
          <span className={`text-xs font-semibold py-1 px-2 rounded-full ${badgeColor}`}>{badgeText}</span>
        </div>
        <h2 className="text-lg font-semibold">{ticket.evenement.description}</h2>
        <p className="text-sm text-gray-700">Offre : {ticket.offre.libelle}</p>
        <p className="text-sm text-gray-700">Nombre de personnes : {ticket.offre.nb_personne}</p>
        <p className="text-sm text-gray-700">Montant : {ticket.offre.montant} €</p>
        <p className="text-sm text-gray-700 mb-4">Description : {ticket.offre.description}</p>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
          onClick={handleOpenModal}
        >
          QrCode
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full shadow-lg relative">
            <QRCodeModal handleCloseModal={handleCloseModal} ticket_id={ticket.id} />
          </div>
        </div>
      )}
    </>
  );
}
