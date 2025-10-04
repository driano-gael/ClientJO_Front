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
  refreshToken,
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
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        setCurrentRoute(currentPath);
      }
    }

    clearUserData();
    setShowSessionExpiredModal(true);
  }, [clearUserData]);

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);
    router.push('/');
  };

  //Initialisation de l'auth
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
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
          // Token invalide ou absent, essayer le refresh
          try {
            await refreshToken();
            if (mounted) {
              const restored = tryRestoreUserFromStorage();
              if (!restored) {
                clearTokens();
              }
            }
          } catch {
            // Échec du refresh, nettoyer complètement
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
  }, [tryRestoreUserFromStorage, forceLogout, clearUserData]);

  // 🔓 login
  const login = async (email: string, password: string, shouldRedirect: boolean = true) => {
    try {
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

      if (shouldRedirect && currentRoute) {
        const target = currentRoute;
        setCurrentRoute(null);
        // Redirection immédiate sans timeout pour éviter les race conditions
        router.push(target);
      }
    } catch (error) {
      throw error;
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
