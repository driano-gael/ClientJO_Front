/**
 * Récupère le token d'authentification depuis le localStorage
 * @returns Le token d'authentification ou null s'il n'existe pas ou si on est côté serveur
 * @example
 * const token = getAuthToken();
 * if (token) {
 *   // Utiliser le token pour l'authentification
 * }
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    const token = localStorage.getItem(tokenKey);
    return token;
  } catch {
    return null;
  }
}

/**
 * Récupère le refresh token depuis le localStorage
 * @returns Le refresh token ou null s'il n'existe pas ou si on est côté serveur
 * @example
 * const refreshToken = getRefreshToken();
 * if (refreshToken) {
 *   // Utiliser le refresh token pour renouveler l'access token
 * }
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  return localStorage.getItem(refreshKey);
}

/**
 * Stocke les tokens d'authentification dans le localStorage
 * @param accessToken - Le token d'accès à stocker
 * @param refreshToken - Le refresh token à stocker (optionnel)
 * @example
 * setTokens('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...', 'refresh_token_here');
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
    const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
    localStorage.setItem(tokenKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(refreshKey, refreshToken);
    }
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
  try {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  } catch {
  }
}

/**
 * Vérifie si le token d'authentification est valide
 * @returns true si le token est valide, false sinon
 * @example
 * const isValid = isTokenValid();
 * if (!isValid) {
 *   // Le token n'est pas valide, rediriger l'utilisateur ou demander un nouveau login
 * }
 */
export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > now;
    return isValid;
  }catch {
    return false;
  }
}

export type SessionExpiredCallback = () => void;
let sessionExpiredCallback: SessionExpiredCallback | null = null;

/**
 * Définit le callback à appeler lorsque la session est expirée
 * @param callback - La fonction à appeler lorsque la session expire
 */
export function setSessionExpiredCallback(callback: SessionExpiredCallback): void {
  sessionExpiredCallback = callback;
}

/**
 * Notifie que la session est expirée
 * @example
 * // Appeler cette fonction lorsque vous détectez que la session de l'utilisateur a expiré
 * notifySessionExpired();
 */
export function notifySessionExpired(): void {
  if (sessionExpiredCallback) {
    sessionExpiredCallback();
  }
}