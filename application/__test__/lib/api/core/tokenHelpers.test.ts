import {
  getAuthToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenValid
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

  it('clearTokens supprime les tokens du localStorage', () => {
    localStorage.setItem('auth_token', 'access');
    localStorage.setItem('auth_refresh_token', 'refresh');
    clearTokens();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_refresh_token')).toBeNull();
  });

  it('isTokenValid retourne false si pas de token', () => {
    expect(isTokenValid()).toBe(false);
  });

  it('isTokenValid retourne true si token JWT non expiré', () => {
    // Génère un JWT valide (exp dans le futur)
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
});

