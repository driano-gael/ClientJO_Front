/**
 * Module de composant QRCodeModal pour l'affichage des QR codes de tickets
 *
 * Ce module contient le composant QRCodeModal qui génère et affiche le QR code associé à un ticket
 * spécifique des Jeux Olympiques. Le composant gère automatiquement le chargement et l'affichage
 * des erreurs lors de la génération du QR code.
 *
 * ## Fonctionnalités principales
 * - Génération automatique du QR code via l'API QrCodeService
 * - Affichage d'un spinner pendant le chargement
 * - Gestion des erreurs de génération
 * - Interface de fermeture du modal
 * - Affichage de l'image QR code en base64
 *
 * ## Flux de fonctionnement
 * 1. Réception de l'ID du ticket en props
 * 2. Validation de l'ID ticket (fermeture si invalide)
 * 3. Appel API pour générer/récupérer le QR code
 * 4. Affichage du QR code ou gestion des erreurs
 * 5. Possibilité de fermer le modal
 *
 * ## Intégration
 * - Utilisé dans BilletCard pour afficher les QR codes des billets
 * - Intégration avec QrCodeService pour les appels API
 * - Gestion d'état local pour le chargement et les données
 *
 * @module components/billet/qrCodeModal
 * @group Components
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "@/type/achat/qrCode";
import Spinner from "@/components/common/Spinner";
import { QrCodeService } from "@/lib/api/service/qrCodeService";

/**
 * Props du composant QRCodeModal
 */
export type QRCodeModalProps = {
  /** Fonction pour fermer le modal */
  handleCloseModal: () => void;
  /** ID du ticket pour lequel générer le QR code */
  ticket_id: number;
};

/**
 * Modal d'affichage du QR code d'un ticket.
 * Voir la documentation du module ci-dessus pour les détails complets.
 *
 * @param props - Les propriétés du composant
 * @returns Modal avec QR code généré ou spinner de chargement
 */
export default function QRCodeModal({ handleCloseModal, ticket_id }: QRCodeModalProps) {
  const [qrCodeData, setQrCodeData] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ticket_id) {
      handleCloseModal();
      return;
    }
    const fetchQrCode = async () => {
      try {
        setLoading(true);
        console.log("Fetching QR Code...");
        const data = await QrCodeService.getQrCodeClient(ticket_id);
        setQrCodeData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQrCode();
  }, [ticket_id, handleCloseModal]);

  return (
    <>
      {loading && <Spinner />}
      <div className="flex flex-col items-center justify-between p-[10%] h-full">
        <div className="w-full flex justify-end">
          <button onClick={handleCloseModal}>x</button>
        </div>
        {qrCodeData && (
          <Image
            src={`data:image/png;base64,${qrCodeData.data}`}
            alt="QR Code"
            width={200}
            height={200}
          />
        )}
      </div>
    </>
  );
}
