// __test__/LoginClientForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginClientForm from '@/components/connexion/LoginClientForm';
import { login as mockLogin } from '@/lib/api/authService';

jest.mock('@/lib/api/authService', () => ({
  login: jest.fn(),
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

    render(<LoginClientForm onClick={onClickMock} onLoginSuccess={onLoginSuccessMock} />);

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

    render(<LoginClientForm onClick={onClickMock} />);

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
    render(<LoginClientForm onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});
