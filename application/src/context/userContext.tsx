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
  logout as logoutService,
  refreshToken,
} from '@/lib/api/auth/authService';
import {
  setSessionExpiredCallback,
  isTokenValid,
} from '@/lib/api/core/tokenHelpers';
import SessionExpiredModal from '@/components/connexion/SessionExpiredModal';

// ----------------------
// Types
// ----------------------

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
    const email = localStorage.getItem('email');
    const nom = localStorage.getItem('nom');
    const id = localStorage.getItem('id');
    if (email && nom && id) {
      return { email, nom, id };
    }
    return null;
  };

  // tentative de restauration
const tryRestoreUserFromStorage = useCallback((): boolean => {
  const userData = loadUserFromLocalStorage();
  if (userData) {
    setUser(userData);
    return true;
  } else {
    logoutService();
    return false;
  }
}, []);

  // 🔒 Forcer la déconnexion (expiration de session)
const forceLogout = useCallback(() => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '/login') {
      setCurrentRoute(currentPath);
    }
  }
  logoutService();
  localStorage.removeItem('email');
  localStorage.removeItem('nom');
  localStorage.removeItem('id');
  setUser(null);
  setShowSessionExpiredModal(true);
}, []);

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(false);
    router.push('/');
  };

  //Initialisation de l'auth
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const tokenValid = isTokenValid();
          if (tokenValid) {
            tryRestoreUserFromStorage();
          } else {
            try {
              await refreshToken();
              tryRestoreUserFromStorage();
            } catch {
              logoutService();
            }
          }
        } catch  {
          logoutService();
        }
      }
      setIsLoading(false);
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
      if (typeof window !== 'undefined') {
        window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      }
    };
  }, [tryRestoreUserFromStorage, forceLogout]);

  // 🔓 login
  const login = async (email: string, password: string, shouldRedirect: boolean = true) => {
    try {
      await loginService({ email, password });

      const fakeUser: User = {
        email,
        nom: 'NomDeTest',
        id: '123456789',
      };

      localStorage.setItem('email', fakeUser.email);
      localStorage.setItem('nom', fakeUser.nom);
      localStorage.setItem('id', fakeUser.id);

      setUser(fakeUser);

      if (shouldRedirect) {
        if (currentRoute) {
          setTimeout(() => {
            const target = currentRoute;
            setCurrentRoute(null);
            router.push(target);
          }, 100);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // 🔓 logout normal
  const logout = () => {
    logoutService();
    localStorage.removeItem('email');
    localStorage.removeItem('nom');
    localStorage.removeItem('id');
    setUser(null);
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
