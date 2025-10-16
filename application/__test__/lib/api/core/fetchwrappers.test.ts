import { fetchApi } from '@/lib/api/core/fetchWrappers';
import { refreshToken } from '@/lib/api/auth/authService';
import { clearTokens, notifySessionExpired, getAuthToken } from '@/lib/api/core/tokenHelpers';

jest.mock('@/lib/api/auth/authService');
jest.mock('@/lib/api/core/tokenHelpers', () => ({
  ...jest.requireActual('@/lib/api/core/tokenHelpers'),
  clearTokens: jest.fn(),
  notifySessionExpired: jest.fn(),
  getAuthToken: jest.fn(),
}));

describe('fetchApi', () => {
  const originalFetch = global.fetch;
  const mockRefreshToken = refreshToken as jest.MockedFunction<typeof refreshToken>;
  const mockClearTokens = clearTokens as jest.MockedFunction<typeof clearTokens>;
  const mockNotifySessionExpired = notifySessionExpired as jest.MockedFunction<typeof notifySessionExpired>;
  const mockGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: {
          get: (key: string) => {
            if (key === 'Content-Type') return 'application/json';
            return null;
          },
        },
        json: () => Promise.resolve({ success: true }),
      } as Response)
    ) as jest.Mock;
    localStorage.clear();
    jest.clearAllMocks();
    mockGetAuthToken.mockReturnValue(null); // Par défaut, pas de token
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('appelle fetch avec les bons paramètres sans auth', async () => {
    await fetchApi('/test-endpoint', { method: 'GET' }, false);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/test-endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('ajoute le header Authorization si requiresAuth est true', async () => {
    // Simuler la présence d'un token
    mockGetAuthToken.mockReturnValue('fake-token');

    await fetchApi('/secure-endpoint', { method: 'GET' }, true);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/secure-endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        }),
      })
    );
  });

  it('n\'ajoute pas Authorization si token absent', async () => {
    mockGetAuthToken.mockReturnValue(null);

    await fetchApi('/secure-endpoint', { method: 'GET' }, true);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/secure-endpoint',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('gère une réponse 401 et tente de rafraîchir le token', async () => {
    // Premier appel retourne 401
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
      } as unknown as Response)
      // Deuxième appel après refresh réussit
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ success: true }),
      } as unknown as Response) as jest.Mock;

    mockRefreshToken.mockResolvedValue({ access: 'new-token', refresh: 'new-refresh' });

    const result = await fetchApi('/secure-endpoint', {}, true);

    expect(mockRefreshToken).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ success: true });
  });

  it('nettoie les tokens si le refresh échoue', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
    } as unknown as Response) as jest.Mock;

    mockRefreshToken.mockRejectedValue(new Error('Refresh failed'));

    await expect(fetchApi('/secure-endpoint', {}, true)).rejects.toThrow('Session expirée');

    expect(mockClearTokens).toHaveBeenCalled();
    expect(mockNotifySessionExpired).toHaveBeenCalled();
  });

  it('retourne du texte si Content-Type n\'est pas JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve('Plain text response'),
    } as unknown as Response) as jest.Mock;

    const result = await fetchApi('/text-endpoint', {}, false);

    expect(result).toBe('Plain text response');
  });

  it('gère les erreurs HTTP avec contenu JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ error: 'Bad request' }),
    } as unknown as Response) as jest.Mock;

    await expect(fetchApi('/error-endpoint', {}, false)).rejects.toThrow('HTTP error: 400');
  });

  it('gère les erreurs HTTP avec contenu texte', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve('Internal server error'),
    } as unknown as Response) as jest.Mock;

    await expect(fetchApi('/error-endpoint', {}, false)).rejects.toThrow('HTTP error: 500');
  });

  it('dispatch un événement tokenRefreshed après refresh réussi', async () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ success: true }),
      } as unknown as Response) as jest.Mock;

    mockRefreshToken.mockResolvedValue({ access: 'new-token', refresh: 'new-refresh' });

    await fetchApi('/secure-endpoint', {}, true);

    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe('tokenRefreshed');

    dispatchEventSpy.mockRestore();
  });
});