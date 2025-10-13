import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {MockPaymentRequest, MockPaymentResponse} from "@/type/paiement/paiement";

/**
 * Service pour la gestion des paiements
 */
export class PaiementService {
  /** Chemin de base pour les endpoints de paiement */
  private static readonly BASE_PATH = '/payment/check/';

  /**
   * Effectue une vérification de paiement avec les données fournies
   * @param payload - Données de la requête de paiement
   * @returns Promise<MockPaymentResponse> - Réponse du service de paiement
   * @throws Error - En cas d'erreur de l'API ou de paiement
   */
  static async checkPaiement(payload: MockPaymentRequest): Promise<MockPaymentResponse> {
    const url = `${this.BASE_PATH}`;
    return fetchApi<MockPaymentResponse>(
        url,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)},
        true
    );
  }
}