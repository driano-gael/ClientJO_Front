'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode, useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  login as loginService,
  refreshToken as refreshTokenService,
} from '@/lib/api/auth/authService';
import {
  setSessionExpiredCallback,
  isTokenValid,
  clearTokens,
} from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';


interface User {
  id: string;
  nom: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, shouldRedirect?: boolean) => Promise<void>;
  logout: () => void;
  forceLogout: () => void;
  currentRoute: string | null;
  saveCurrentRoute: (route: string) => void;
  getAndClearSavedRoute: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------
// Provider
// ----------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Nouveau flag
  const isAuthenticated = !!user;

  // chargement local
  const loadUserFromLocalStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const email = localStorage.getItem('email');
      const nom = localStorage.getItem('nom');
      const id = localStorage.getItem('id');
      if (email && nom && id) {
        return { email, nom, id };
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
    return null;
  };

  // Nettoyer complètement l'état utilisateur
  const clearUserData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('email');
        localStorage.removeItem('nom');
        localStorage.removeItem('id');
      } catch (error) {
        console.error('Erreur lors du nettoyage des données utilisateur:', error);
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  // tentative de restauration
  const tryRestoreUserFromStorage = useCallback((): boolean => {
    const userData = loadUserFromLocalStorage();
    if (userData) {
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  // 🔒 Forcer la déconnexion (expiration de session)
  const forceLogout = useCallback(() => {
    // Ne pas déclencher pendant l'authentification
    if (isAuthenticating) {
      console.log('[forceLogout] Authentification en cours, ignorer forceLogout');
      return;
    }

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        setCurrentRoute(currentPath);
      }
    }

    clearUserData();
    setShowSessionExpiredModal(true);
  }, [clearUserData, isAuthenticating]);

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);
    router.push('/');
  };

  //Initialisation de l'auth
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      // Ne pas vérifier pendant l'authentification
      if (isAuthenticating) {
        console.log('[checkAuth] Authentification en cours, skip checkAuth');
        return;
      }

      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const tokenValid = isTokenValid();

        if (tokenValid) {
          // Token valide, essayer de restaurer l'utilisateur
          if (mounted) {
            const restored = tryRestoreUserFromStorage();
            if (!restored) {
              // Pas d'utilisateur en localStorage mais token valide
              // Probablement un problème de sync, nettoyer
              clearTokens();
            }
          }
        } else {
          // Token invalide ou absent
          const refreshToken = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token');

          if (refreshToken) {
            // Il y a un refresh token, essayer de l'utiliser
            try {
              console.log('[checkAuth] Token expiré, tentative de refresh');
              await refreshTokenService();
              if (mounted) {
                const restored = tryRestoreUserFromStorage();
                if (!restored) {
                  clearTokens();
                }
              }
            } catch {
              // Échec du refresh, nettoyer complètement
              console.log('[checkAuth] Refresh échoué, nettoyage');
              if (mounted) {
                clearUserData();
              }
            }
          } else {
            // Pas de refresh token, nettoyer directement sans faire de requête
            console.log('[checkAuth] Pas de refresh token disponible, nettoyage direct');
            if (mounted) {
              clearUserData();
            }
          }
        }
      } catch {
        console.error('Erreur lors de la vérification de l\'authentification');
        if (mounted) {
          clearUserData();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    setSessionExpiredCallback(forceLogout);

    const handleTokenRefreshed = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔁 Token refreshé ailleurs, sync context');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    }

    checkAuth();

    return () => {
      mounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      }
    };
  }, [tryRestoreUserFromStorage, forceLogout, clearUserData, isAuthenticating]);

  // 🔓 login
  const login = async (email: string, password: string, shouldRedirect: boolean = true) => {
    try {
      setIsAuthenticating(true); // Marquer le début de l'authentification
      console.log('[login] Début de l\'authentification');

      await loginService({ email, password });

      const fakeUser: User = {
        email,
        nom: 'NomDeTest',
        id: '123456789',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('email', fakeUser.email);
        localStorage.setItem('nom', fakeUser.nom);
        localStorage.setItem('id', fakeUser.id);
      }

      setUser(fakeUser);
      console.log('[login] Utilisateur défini, authentification terminée');

      if (shouldRedirect && currentRoute) {
        const target = currentRoute;
        setCurrentRoute(null);
        // Redirection immédiate sans timeout pour éviter les race conditions
        router.push(target);
      }
    } catch (error) {
      throw error;
    } finally {
      // Délai court pour s'assurer que localStorage est synchronisé
      setTimeout(() => {
        setIsAuthenticating(false);
        console.log('[login] Flag isAuthenticating remis à false');
      }, 100);
    }
  };

  // 🔓 logout normal
  const logout = () => {
    clearUserData();
    router.push('/');
  };

  const saveCurrentRoute = (route: string) => {
    setCurrentRoute(route);
  };

  const getAndClearSavedRoute = () => {
    const route = currentRoute;
    setCurrentRoute(null);
    return route;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    forceLogout,
    currentRoute,
    saveCurrentRoute,
    getAndClearSavedRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onClose={() => setShowSessionExpiredModal(false)}
        onReconnect={handleSessionExpired}
      />
    </AuthContext.Provider>
  );
}

// ----------------------
// Hook personnalisé
// ----------------------

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
