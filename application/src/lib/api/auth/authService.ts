import { fetchApi } from '@/lib/api/core/fetchWrappers';

export async function login(
    dataForm:{
        email: string, 
        password: string
    }) 
{
    const data = await fetchApi('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(dataForm),
    }) as { access: string; refresh: string };
    if (!data.access) {
        throw new Error('Token non trouvé dans la réponse du serveur.');
    }
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY;
    const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY;
    if (!tokenKey || !refreshKey) {
        throw new Error('Clé de token manquante dans les variables d’environnement');
    }
    localStorage.setItem(tokenKey, data.access);
    localStorage.setItem(refreshKey, data.refresh);
    return data;
}

export function logout() {
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!);
}

export async function registerClient(
    data: {
        email: string;
        password: string;
        nom: string;
        prenom: string;
        telephone: string;
    })
{
    return await fetchApi('/auth/register/client', {
        method: 'POST',
        body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: 'client',
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        }),
    });
}

export async function refreshToken() {
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;
  const refresh = localStorage.getItem(refreshKey);
  if (!refresh) throw new Error("Refresh token manquant");

  const data = await fetchApi('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }) as { access: string; refresh: string };

  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
  localStorage.setItem(tokenKey, data.access);
  return data;
}