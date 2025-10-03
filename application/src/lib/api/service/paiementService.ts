import {fetchApi} from '@/lib/api/core/fetchWrappers';
import {MockPaymentRequest, MockPaymentResponse} from "@/type/paiement/paiement";



export class PaiementService {
  private static readonly BASE_PATH = '/payment/check/';

  static async checkPaiement(payload: MockPaymentRequest ): Promise<MockPaymentResponse> {
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