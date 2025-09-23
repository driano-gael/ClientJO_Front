// __test__/LoginClientForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginClientForm from '@/components/connexion/LoginClientForm';
import { login as mockLogin } from '@/lib/api/auth/authService';
import { AuthProvider } from '@/context/userContext';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

jest.mock('@/lib/api/auth/authService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

describe('LoginClientForm', () => {
  const onClickMock = jest.fn();
  const onLoginSuccessMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('appelle login avec les bons paramètres', async () => {
    (mockLogin as jest.Mock).mockResolvedValue({
      access: 'fake-access-token',
      refresh: 'fake-refresh-token',
    });

    render(
      <AuthProvider>
        <LoginClientForm onClick={onClickMock} onLoginSuccess={onLoginSuccessMock} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(onLoginSuccessMock).toHaveBeenCalled();
    });
  });

  it('affiche une erreur si le login échoue', async () => {
    (mockLogin as jest.Mock).mockRejectedValue(new Error('Identifiants invalides'));

    render(
      <AuthProvider>
        <LoginClientForm onClick={onClickMock} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
  });

  it("n'appelle pas login si les champs sont vides", async () => {
    render(
      <AuthProvider>
        <LoginClientForm onClick={onClickMock} />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});
