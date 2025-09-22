import { getAuthToken } from './tokenHelpers';


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


export async function makeRequest(
    endpoint: string,
    options: RequestInit,
    requiresAuth: boolean
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
