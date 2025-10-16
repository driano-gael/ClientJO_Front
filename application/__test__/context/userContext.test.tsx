import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/context/userContext';
import * as authService from '@/lib/api/auth/authService';
import * as tokenHelpers from '@/lib/api/core/tokenHelpers';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock authService
jest.mock('@/lib/api/auth/authService', () => ({
  login: jest.fn(),
  refreshToken: jest.fn()
}));

// Mock tokenHelpers
jest.mock('@/lib/api/core/tokenHelpers', () => ({
  setSessionExpiredCallback: jest.fn(),
  isTokenValid: jest.fn(),
  clearTokens: jest.fn()
}));

// Mock SessionExpiredModal
jest.mock('@/components/connexion/SessionExpiredModal', () => {
  return function MockSessionExpiredModal({ isOpen, onClose, onReconnect }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="session-expired-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onReconnect}>Reconnect</button>
      </div>
    );
  };
});

describe('userContext', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    pathname: '/',
    query: {},
    asPath: '/'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AuthProvider - Initialization', () => {
    it('initialise le contexte avec isLoading=true puis passe à false', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      // isLoading devrait passer à false après l'initialisation
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('restaure l\'utilisateur depuis localStorage si le token est valide', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('nom', 'Test User');
      localStorage.setItem('id', '123');
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({
        email: 'test@test.com',
        nom: 'Test User',
        id: '123'
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('nettoie les données si le token est invalide et pas de refresh token', async () => {
      localStorage.setItem('email', 'test@test.com');
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(tokenHelpers.clearTokens).toHaveBeenCalled();
    });

    it('tente de refresh le token si disponible', async () => {
      localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token', 'refresh123');
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('nom', 'Test User');
      localStorage.setItem('id', '123');

      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);
      (authService.refreshToken as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(authService.refreshToken).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('nettoie les données si le refresh échoue', async () => {
      localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token', 'refresh123');

      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);
      (authService.refreshToken as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('nettoie si le token est valide mais pas d\'utilisateur en localStorage', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(tokenHelpers.clearTokens).toHaveBeenCalled();
      });
    });
  });

  describe('login', () => {
    it('connecte un utilisateur avec succès', async () => {
      (authService.login as jest.Mock).mockResolvedValue({});
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test@test.com', 'password', false);
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      });

      expect(result.current.user).toEqual({
        email: 'test@test.com',
        nom: 'NomDeTest',
        id: '123456789'
      });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('redirige vers la route sauvegardée après connexion', async () => {
      jest.useFakeTimers();
      (authService.login as jest.Mock).mockResolvedValue({});
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveCurrentRoute('/panier');
      });

      await act(async () => {
        await result.current.login('test@test.com', 'password', true);
      });

      expect(mockPush).toHaveBeenCalledWith('/panier');

      jest.useRealTimers();
    });

    it('ne redirige pas si shouldRedirect est false', async () => {
      (authService.login as jest.Mock).mockResolvedValue({});
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveCurrentRoute('/panier');
      });

      await act(async () => {
        await result.current.login('test@test.com', 'password', false);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('propage l\'erreur en cas d\'échec de connexion', async () => {
      const error = new Error('Invalid credentials');
      (authService.login as jest.Mock).mockRejectedValue(error);
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login('test@test.com', 'wrong', false);
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('déconnecte l\'utilisateur et redirige vers la page d\'accueil', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('nom', 'Test User');
      localStorage.setItem('id', '123');
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(tokenHelpers.clearTokens).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('forceLogout', () => {
    it('affiche le modal de session expirée', async () => {
      localStorage.setItem('email', 'test@test.com');
      localStorage.setItem('nom', 'Test User');
      localStorage.setItem('id', '123');
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      // Mock window.location.pathname
      Object.defineProperty(window, 'location', {
        value: { pathname: '/evenements' },
        writable: true
      });

      act(() => {
        result.current.forceLogout();
      });

      expect(result.current.user).toBeNull();
    });

    it('ne sauvegarde pas la route si on est sur la page d\'accueil', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      });

      act(() => {
        result.current.forceLogout();
      });

      expect(result.current.currentRoute).toBeNull();
    });
  });

  describe('route management', () => {
    it('sauvegarde et récupère une route', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveCurrentRoute('/panier');
      });

      expect(result.current.currentRoute).toBe('/panier');

      let savedRoute;
      act(() => {
        savedRoute = result.current.getAndClearSavedRoute();
      });

      expect(savedRoute).toBe('/panier');
      expect(result.current.currentRoute).toBeNull();
    });
  });

  describe('useAuth hook error', () => {
    it('lance une erreur si utilisé en dehors d\'un AuthProvider', () => {
      // Supprimer les logs d'erreur pour ce test
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth doit être utilisé dans un AuthProvider');

      consoleError.mockRestore();
    });
  });

  describe('loadUserFromLocalStorage', () => {
    it('retourne null si les données sont incomplètes', async () => {
      localStorage.setItem('email', 'test@test.com');
      // Manque nom et id
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('event listeners', () => {
    it('écoute l\'événement tokenRefreshed', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith('tokenRefreshed', expect.any(Function));
    });

    it('nettoie les event listeners au démontage', async () => {
      (tokenHelpers.isTokenValid as jest.Mock).mockReturnValue(false);
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('tokenRefreshed', expect.any(Function));
    });
  });
});

