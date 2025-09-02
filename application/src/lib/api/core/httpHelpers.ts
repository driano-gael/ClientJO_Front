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
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });
    if (!response.ok) {
        let errorMsg = `HTTP error: ${response.status}`;
        try {
            const data = await response.json();
            errorMsg = data?.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
    }
    return response;
}


export async function tryRefreshToken(): Promise<boolean> {
  const refreshTokenKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${baseUrl}/auth/token/refresh/`, {
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
