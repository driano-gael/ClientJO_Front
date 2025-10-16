import { QrCodeService } from '@/lib/api/service/qrCodeService';
import { fetchApi } from '@/lib/api/core/fetchWrappers';

// Mock fetchApi
jest.mock('@/lib/api/core/fetchWrappers');
const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('QrCodeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQrCodeClient', () => {
    it('génère un QR code pour un ticket client', async () => {
      const mockQrResponse = {
        id: 1,
        ticket_id: 1,
        qr_code_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEA...',
        created_at: '2024-10-16T10:00:00Z',
        is_used: false
      };

      mockFetchApi.mockResolvedValue(mockQrResponse);

      const result = await QrCodeService.getQrCodeClient(1);

      expect(mockFetchApi).toHaveBeenCalledWith('/qr_code_service/create_by_ticket/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: 1 })
      }, true);
      expect(result).toEqual(mockQrResponse);
    });

    it('gère les erreurs de génération de QR code', async () => {
      const error = new Error('Erreur génération QR code');
      mockFetchApi.mockRejectedValue(error);

      await expect(QrCodeService.getQrCodeClient(1)).rejects.toThrow('Erreur génération QR code');
    });

    it('appelle le service avec le bon ticket ID', async () => {
      const mockQrResponse = {
        id: 2,
        ticket: {} as any, // Le type QRCode a une propriété 'ticket' et non 'ticket_id'
        data: 'qr_data_123'
      };

      mockFetchApi.mockResolvedValue(mockQrResponse);

      const result = await QrCodeService.getQrCodeClient(123);

      expect(mockFetchApi).toHaveBeenCalledWith('/qr_code_service/create_by_ticket/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: 123 })
      }, true);
      expect(result).toBeDefined();
    });
  });
});
