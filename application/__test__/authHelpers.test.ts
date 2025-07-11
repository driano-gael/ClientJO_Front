import { buildHeaders, makeRequest, tryRefreshToken } from '@/lib/api/authHelpers';

describe('authHelpers', () => {
  const originalFetch = global.fetch;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
  const refreshTokenKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  beforeEach(() => {
    // Mock localStorage clear before each test
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch; // Restore fetch after each test
  });

  describe('buildHeaders', () => {
    it('ajoute Content-Type par défaut', () => {
      const headers = buildHeaders(false);
      expect(headers).toEqual({ 'Content-Type': 'application/json' });
    });

    it('fusionne les headers de base', () => {
      const baseHeaders = { 'X-Custom-Header': 'abc' };
      const headers = buildHeaders(false, baseHeaders);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'X-Custom-Header': 'abc',
      });
    });

    it('ajoute Authorization si requiresAuth=true et token présent', () => {
      localStorage.setItem(tokenKey, 'fake-token');
      const headers = buildHeaders(true);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-token',
      });
    });

    it('n\'ajoute pas Authorization si requiresAuth=true mais token absent', () => {
      const headers = buildHeaders(true);
      expect(headers).toEqual({ 'Content-Type': 'application/json' });
    });

    it('n\'ajoute pas Authorization si requiresAuth=false', () => {
      localStorage.setItem(tokenKey, 'fake-token');
      const headers = buildHeaders(false);
      expect(headers).toEqual({ 'Content-Type': 'application/json' });
    });
  });

  describe('makeRequest', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: {
            get: (key: string) => (key === 'Content-Type' ? 'application/json' : null),
          },
          json: () => Promise.resolve({ success: true }),
        } as Response)
      ) as jest.Mock;
    });

    it('appelle fetch avec bonne URL et headers', async () => {
      await makeRequest('/endpoint', { method: 'GET' }, false);
      expect(global.fetch).toHaveBeenCalledWith(
        baseUrl + '/endpoint',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('inclut Authorization si requiresAuth=true et token présent', async () => {
      localStorage.setItem(tokenKey, 'fake-token');
      await makeRequest('/secure', { method: 'GET' }, true);
      expect(global.fetch).toHaveBeenCalledWith(
        baseUrl + '/secure',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer fake-token',
          },
        })
      );
    });
  });

  describe('tryRefreshToken', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('retourne false si pas de refresh token en localStorage', async () => {
      const result = await tryRefreshToken();
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('retourne false si fetch retourne une réponse non ok', async () => {
      localStorage.setItem(refreshTokenKey, 'refresh-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });
      const result = await tryRefreshToken();
      expect(result).toBe(false);
    });

    it('stocke le nouveau token et retourne true si succès', async () => {
      localStorage.setItem(refreshTokenKey, 'refresh-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access: 'new-access-token' }),
      });
      const result = await tryRefreshToken();
      expect(result).toBe(true);
      expect(localStorage.getItem(tokenKey)).toBe('new-access-token');
    });

    it('retourne false si réponse ok mais pas de token access', async () => {
      localStorage.setItem(refreshTokenKey, 'refresh-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });
      const result = await tryRefreshToken();
      expect(result).toBe(false);
    });
  });
});
