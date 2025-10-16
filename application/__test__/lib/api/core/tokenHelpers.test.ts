import {
  getAuthToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenValid,
  setSessionExpiredCallback,
  notifySessionExpired
} from '@/lib/api/core/tokenHelpers';

describe('tokenHelpers', () => {
  beforeEach(() => {
    localStorage.clear();
    process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'auth_token';
    process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
  });

  it('getAuthToken retourne le token si présent', () => {
    localStorage.setItem('auth_token', 'token123');
    expect(getAuthToken()).toBe('token123');
  });

  it('getAuthToken retourne null si absent', () => {
    expect(getAuthToken()).toBeNull();
  });

  it('getAuthToken gère les erreurs de localStorage', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = jest.fn(() => {
      throw new Error('localStorage error');
    });
    
    expect(getAuthToken()).toBeNull();
    
    Storage.prototype.getItem = originalGetItem;
  });

  it('getRefreshToken retourne le refresh token si présent', () => {
    localStorage.setItem('auth_refresh_token', 'refresh123');
    expect(getRefreshToken()).toBe('refresh123');
  });

  it('getRefreshToken retourne null si absent', () => {
    expect(getRefreshToken()).toBeNull();
  });

  it('setTokens stocke les tokens dans localStorage', () => {
    setTokens('access', 'refresh');
    expect(localStorage.getItem('auth_token')).toBe('access');
    expect(localStorage.getItem('auth_refresh_token')).toBe('refresh');
  });

  it('setTokens stocke seulement access token si refresh non fourni', () => {
    setTokens('access');
    expect(localStorage.getItem('auth_token')).toBe('access');
    expect(localStorage.getItem('auth_refresh_token')).toBeNull();
  });

  it('setTokens gère les erreurs de localStorage', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error('localStorage error');
    });
    
    expect(() => setTokens('access', 'refresh')).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    Storage.prototype.setItem = originalSetItem;
    consoleErrorSpy.mockRestore();
  });

  it('clearTokens supprime les tokens du localStorage', () => {
    localStorage.setItem('auth_token', 'access');
    localStorage.setItem('auth_refresh_token', 'refresh');
    clearTokens();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_refresh_token')).toBeNull();
  });

  it('clearTokens gère les erreurs silencieusement', () => {
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = jest.fn(() => {
      throw new Error('localStorage error');
    });
    
    expect(() => clearTokens()).not.toThrow();
    
    Storage.prototype.removeItem = originalRemoveItem;
  });

  it('isTokenValid retourne false si pas de token', () => {
    expect(isTokenValid()).toBe(false);
  });

  it('isTokenValid retourne true si token JWT non expiré', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const base64Payload = btoa(JSON.stringify(payload));
    const token = `header.${base64Payload}.signature`;
    localStorage.setItem('auth_token', token);
    expect(isTokenValid()).toBe(true);
  });

  it('isTokenValid retourne false si token JWT expiré', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    const base64Payload = btoa(JSON.stringify(payload));
    const token = `header.${base64Payload}.signature`;
    localStorage.setItem('auth_token', token);
    expect(isTokenValid()).toBe(false);
  });

  it('isTokenValid retourne false si token malformé', () => {
    localStorage.setItem('auth_token', 'invalid-token');
    expect(isTokenValid()).toBe(false);
  });

  it('setSessionExpiredCallback définit le callback', () => {
    const callback = jest.fn();
    setSessionExpiredCallback(callback);
    notifySessionExpired();
    expect(callback).toHaveBeenCalled();
  });

  it('notifySessionExpired appelle le callback si défini', () => {
    const callback = jest.fn();
    setSessionExpiredCallback(callback);
    notifySessionExpired();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('notifySessionExpired ne fait rien si aucun callback défini', () => {
    expect(() => notifySessionExpired()).not.toThrow();
  });
});
