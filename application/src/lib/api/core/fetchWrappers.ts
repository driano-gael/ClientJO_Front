import { makeRequest } from './httpHelpers';
import { refreshToken } from '../auth/authService';
import { clearTokens, notifySessionExpired } from './tokenHelpers';


const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;

if (!baseUrl) throw new Error("API base URL is not défini.");
if (!tokenKey) throw new Error("NEXT_PUBLIC_AUTH_TOKEN_KEY est manquant.");
if (!refreshKey) throw new Error("NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY est manquant.");


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