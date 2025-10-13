import { getAuthToken } from './tokenHelpers';

/**
 * Construit les en-têtes HTTP pour une requête API
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @param baseHeaders - En-têtes de base à inclure (optionnel)
 * @returns Headers configurés pour la requête
 * @example
 * const headers = buildHeaders(true, { 'Custom-Header': 'value' });
 */
export function buildHeaders(
  requiresAuth: boolean,
  baseHeaders: HeadersInit = {}
): HeadersInit {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (baseHeaders) {
        if (baseHeaders instanceof Headers) {
            baseHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(baseHeaders)) {
            baseHeaders.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            Object.assign(headers, baseHeaders);
        }
    }
    if (requiresAuth) {
        const token = getAuthToken();
        console.log('[buildHeaders] Token utilisé:', token);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
}


/**
 * Effectue une requête HTTP vers l'API avec gestion des en-têtes et de l'authentification
 * @param endpoint - Point de terminaison de l'API
 * @param options - Options de la requête fetch
 * @param requiresAuth - Indique si la requête nécessite une authentification
 * @returns Promise contenant la réponse Response
 * @throws Error - En cas d'erreur réseau ou de configuration
 */
export async function makeRequest(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
): Promise<Response> {
    const headers = buildHeaders(requiresAuth, options.headers);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    console.log('[makeRequest] URL:', baseUrl + cleanEndpoint, 'Headers:', headers);
    const response = await fetch(baseUrl + cleanEndpoint, {
        ...options,
        headers,
    });
    console.log(headers)
    // Ne pas lever d'erreur ici, laisser fetchApi gérer le 401 et autres erreurs
    return response;
}


/**
 * Tente de rafraîchir le token d'authentification en utilisant le refresh token
 * @returns Promise<boolean> - true si le token a été rafraîchi avec succès, false sinon
 * @example
 * const success = await tryRefreshToken();
 * if (success) {
 *   // Token rafraîchi, on peut réessayer la requête
 * }
 */
export async function tryRefreshToken(): Promise<boolean> {
  console.log("[tryRefreshToken] Tentative de rafraîchissement du token");
  const refreshTokenKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${baseUrl}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (data.access) {
      localStorage.setItem(tokenKey, data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
