import { makeRequest } from './httpHelpers';
import { refreshToken } from '../auth/authService';
import { clearTokens, notifySessionExpired } from './tokenHelpers';


const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");

/**
 * Fonction principale pour effectuer des appels API avec gestion automatique de l'authentification
 * Gère automatiquement le rafraîchissement des tokens en cas d'expiration
 * @param endpoint - Point de terminaison de l'API (chemin relatif)
 * @param options - Options pour la requête fetch (méthode, headers, body, etc.)
 * @param requiresAuth - Indique si la requête nécessite une authentification (défaut: true)
 * @returns Promise contenant la réponse désérialisée de l'API
 * @throws Error - En cas d'erreur réseau, d'authentification ou de validation
 * @example
 * // Appel simple avec authentification
 * const data = await fetchApi<User[]>('/users');
 *
 * // Appel POST avec données
 * const result = await fetchApi<CreateResponse>('/users', {
 *   method: 'POST',
 *   body: JSON.stringify(userData)
 * });
 *
 * // Appel sans authentification
 * const publicData = await fetchApi<PublicData>('/public/info', {}, false);
 */
export async function fetchApi<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth = true
): Promise<T> {
    console.log('[fetchApi] Début, endpoint:', endpoint, 'options:', options, 'requiresAuth:', requiresAuth);
    let response = await makeRequest(endpoint, options, requiresAuth);
    console.log('[fetchApi] Réponse initiale:', response.status);
    if (response.status === 401 && requiresAuth) {
        console.log('[fetchApi] 401 détecté, tentative de refresh du token');
        const refreshed = await tryRefreshToken();
        console.log('[fetchApi] Résultat du refresh:', refreshed);
        if (refreshed) {
            console.log('[fetchApi] Token rafraîchi, nouvelle tentative de requête');
            response = await makeRequest(endpoint, options, requiresAuth);
            console.log('[fetchApi] Réponse après refresh:', response.status);
        } else {
            console.log('[fetchApi] Refresh échoué, clearTokens et notifySessionExpired');
            clearTokens();
            notifySessionExpired();
            throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
    }
    const contentType = response.headers.get("Content-Type") || "";
    if (!response.ok) {
        const errorData = contentType.includes("application/json")
          ? await response.json().catch(() => ({}))
          : await response.text();
        console.log('[fetchApi] Erreur HTTP:', response.status, errorData);
        throw new Error(`HTTP error: ${response.status}`);
    }
    if (contentType.includes("application/json")) {
        const json = await response.json();
        console.log('[fetchApi] Réponse JSON:', json);
        return json;
    }
    const text = await response.text();
    console.log('[fetchApi] Réponse texte:', text);
    return text as T;
}


async function tryRefreshToken(): Promise<boolean> {
  try {
    await refreshToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tokenRefreshed'));
    }
    return true;
  } catch {
    return false;
  }
}