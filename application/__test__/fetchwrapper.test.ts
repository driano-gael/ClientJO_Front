import { fetchApi } from '@/lib/api/fetchWrapper';

describe('fetchApi', () => {
  const originalFetch = global.fetch;

    beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
        ok: true,
        status: 200,
        headers: {
            get: (key: string) => {
            if (key === 'Content-Type') return 'application/json';
            return null;
            },
        },
        json: () => Promise.resolve({ success: true }),
        } as Response)
    ) as jest.Mock;
    localStorage.clear();
    });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('appelle fetch avec les bons paramètres sans auth', async () => {
    await fetchApi('/test-endpoint', { method: 'GET' }, false);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/test-endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('ajoute le header Authorization si requiresAuth est true', async () => {
    localStorage.setItem('auth_token', 'fake-token');

    await fetchApi('/secure-endpoint', { method: 'GET' }, true);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/secure-endpoint',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        },
      })
    );
  });

  it('n\'ajoute pas Authorization si token absent', async () => {
    await fetchApi('/secure-endpoint', { method: 'GET' }, true);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/secure-endpoint',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });
});