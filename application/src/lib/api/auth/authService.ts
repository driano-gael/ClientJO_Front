import { fetchApi } from '@/lib/api/core/fetchWrappers';

/**
 * Interface pour les données de connexion
 */
export interface LoginData {
    email: string;
    password: string;
}

/**
 * Connecte un utilisateur avec email et mot de passe
 * @param dataForm - Données de connexion (email et mot de passe)
 * @returns Promise contenant les tokens d'accès et de rafraîchissement
 * @throws Error - En cas d'échec de l'authentification ou de problème de configuration
 * @example
 * try {
 *   const result = await login({ email: 'user@example.com', password: 'password' });
 *   // Utilisateur connecté avec succès
 * } catch (error) {
 *   // Gérer l'erreur de connexion
 * }
 */
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

/**
 * Déconnecte l'utilisateur en supprimant les tokens du localStorage
 * @example
 * logout(); // Supprime tous les tokens et déconnecte l'utilisateur
 */
export function logout() {
    const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY;
    const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY;

    if (typeof window !== 'undefined') {
        if (tokenKey) localStorage.removeItem(tokenKey);
        if (refreshKey) localStorage.removeItem(refreshKey);
    }
}

/**
 * Inscrit un nouvel utilisateur en tant que client
 * @param data - Données d'inscription (email, mot de passe, nom, prénom, téléphone)
 * @returns Promise contenant les détails de l'utilisateur inscrit
 * @throws Error - En cas d'échec de l'inscription
 * @example
 * try {
 *   const result = await registerClient({
 *     email: 'user@example.com',
 *     password: 'password',
 *     nom: 'Doe',
 *     prenom: 'John',
 *     telephone: '0123456789'
 *   });
 *   // Utilisateur inscrit avec succès
 * } catch (error) {
 *   // Gérer l'erreur d'inscription
 * }
 */
export async function registerClient(
    data: {
        email: string;
        password: string;
        nom: string;
        prenom: string;
        telephone: string;
    })
{
    return await fetchApi('/auth/register/client/', {
        method: 'POST',
        body: JSON.stringify({
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        }),
    }, false)
}

/**
 * Rafraîchit le token d'accès en utilisant le refresh token
 * @returns Promise contenant le nouveau token d'accès
 * @throws Error - En cas d'échec du rafraîchissement ou si le refresh token est invalide
 * @example
 * try {
 *   const newToken = await refreshToken();
 *   // Token rafraîchi avec succès
 * } catch (error) {
 *   // Le refresh token est invalide, rediriger vers la page de connexion
 * }
 */
export async function refreshToken() {
  console.log("[AuthService] refreshToken called");
  const refreshKey = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY!;
  const refresh = localStorage.getItem(refreshKey);
  if (!refresh) throw new Error("Refresh token manquant");

  const data = await fetchApi('/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }) as { access: string; refresh: string };

  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY!;
  localStorage.setItem(tokenKey, data.access);
  return data;
}