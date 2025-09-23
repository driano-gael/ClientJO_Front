import { login, logout, registerClient, refreshToken} from '@/lib/api/auth/authService'
import {fetchApi} from "@/lib/api/core/fetchWrappers";

jest.mock('@/lib/api/core/fetchWrappers');

describe('Auth functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY = 'auth_token';
    process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
  });

  describe('login', () => {
    it('doit appeler fetchApi avec les bonnes données et stocker les tokens', async () => {
      const fakeResponse = { access: 'access-token', refresh: 'refresh-token' };
      (fetchApi as jest.Mock).mockResolvedValueOnce(fakeResponse);

      const dataForm = { email: 'test@test.com', password: 'password' };
      const result = await login(dataForm);

      expect(fetchApi).toHaveBeenCalledWith('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(dataForm),
      });

      expect(localStorage.getItem('auth_token')).toBe(fakeResponse.access);
      expect(localStorage.getItem('auth_refresh_token')).toBe(fakeResponse.refresh);
      expect(result).toEqual(fakeResponse);
    });

    it('doit lever une erreur si access token absent dans la réponse', async () => {
      (fetchApi as jest.Mock).mockResolvedValueOnce({});

      await expect(login({ email: 'a', password: 'b' })).rejects.toThrow('Token non trouvé');
    });

    it('doit lever une erreur si les variables d’environnement manquent', async () => {
      delete process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY;
      delete process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY;
      const fakeResponse = { access: 'token', refresh: 'token' };
      (fetchApi as jest.Mock).mockResolvedValueOnce(fakeResponse);

      await expect(login({ email: 'a', password: 'b' })).rejects.toThrow('Clé de token manquante');
    });
  });

  describe('logout', () => {
    it('doit supprimer le token d’accès de localStorage', () => {
      localStorage.setItem('auth_token', 'some-token');
      logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('registerClient', () => {
    it('doit appeler fetchApi avec les bonnes données', async () => {
      const fakeResponse = { success: true };
      (fetchApi as jest.Mock).mockResolvedValueOnce(fakeResponse);

      const clientData = {
        email: 'client@test.com',
        password: 'pass',
        nom: 'Doe',
        prenom: 'John',
        telephone: '0123456789',
      };
      const result = await registerClient(clientData);

      expect(fetchApi).toHaveBeenCalledWith('/auth/register/client/', {
        method: 'POST',
        body: JSON.stringify({
          email: clientData.email,
          password: clientData.password,
          nom: clientData.nom,
          prenom: clientData.prenom,
          telephone: clientData.telephone,
        }),
      });

      expect(result).toEqual(fakeResponse);
    });
  });

  describe('refreshToken', () => {
    it('doit appeler fetchApi avec refresh token et mettre à jour le token d\'accès', async () => {
      localStorage.setItem('auth_refresh_token', 'refresh-token');
      const fakeResponse = { access: 'new-access-token' };
      (fetchApi as jest.Mock).mockResolvedValueOnce(fakeResponse);
      const result = await refreshToken();
      expect(fetchApi).toHaveBeenCalledWith('/auth/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: 'refresh-token' }),
      });
      expect(localStorage.getItem('auth_token')).toBe('new-access-token');
      expect(result).toEqual(fakeResponse);
    });

    it('doit lever une erreur si refresh token absent dans localStorage', async () => {
      localStorage.removeItem('auth_refresh_token');
      await expect(refreshToken()).rejects.toThrow('Refresh token manquant');
    });
  });
});
