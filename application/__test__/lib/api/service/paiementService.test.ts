import { PaiementService } from '@/lib/api/service/paiementService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { MockPaymentRequest } from '@/type/paiement/paiement';

// Mock fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('PaiementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPaiement', () => {
    it('appelle fetchApi pour vérifier le paiement', async () => {
      const mockPaiementData: MockPaymentRequest = {
        amount: 150.00,
        items: [],
        force_failed: false
      };

      const mockResponse = {
        gateway_response: {
          id: 'txn_123',
          status: 'succeeded' as const,
          charges: [{ id: 'ch_123', montant: 150.00 }]
        }
      };

      mockFetchApi.mockResolvedValue(mockResponse);

      const result = await PaiementService.checkPaiement(mockPaiementData);

      expect(mockFetchApi).toHaveBeenCalledWith('/payment/check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPaiementData)
      }, true);
      expect(result).toEqual(mockResponse);
    });

    it('gère les erreurs de paiement', async () => {
      const paiementData: MockPaymentRequest = {
        amount: 150.00,
        items: [],
        force_failed: true
      };

      const error = new Error('Erreur de paiement');
      mockFetchApi.mockRejectedValue(error);

      await expect(PaiementService.checkPaiement(paiementData)).rejects.toThrow('Erreur de paiement');
    });

    it('traite différents montants de paiement', async () => {
      const mockPaiementData: MockPaymentRequest = {
        amount: 299.99,
        items: [],
        force_failed: false
      };

      const mockResponse = {
        gateway_response: {
          id: 'txn_456',
          status: 'succeeded' as const,
          charges: [{ id: 'ch_456', montant: 299.99 }]
        }
      };

      mockFetchApi.mockResolvedValue(mockResponse);

      const result = await PaiementService.checkPaiement(mockPaiementData);

      expect(result.gateway_response.id).toBe('txn_456');
      expect(mockFetchApi).toHaveBeenCalledWith('/payment/check/', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPaiementData)
      }), true);
    });
  });
});
