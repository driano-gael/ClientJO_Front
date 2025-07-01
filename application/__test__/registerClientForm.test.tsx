import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterClientForm from '@/components/connexion/RegisterClientForm';
import { registerClient } from '@/lib/api/authService';

jest.mock('@/lib/api/authService', () => ({
  registerClient: jest.fn(),
}));

jest.mock('@/components/Notification', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

jest.mock('@/components/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}));

describe('RegisterClientForm', () => {
  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Prénom'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Téléphone'), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByRole('checkbox'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le formulaire correctement', () => {
    render(<RegisterClientForm />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it("n'appelle pas registerClient si les CGU ne sont pas acceptées", async () => {
    render(<RegisterClientForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nom'), {
        target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Prénom'), {
        target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText(/téléphone/i), {
        target: { value: '0123456789' },
    });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
        expect(registerClient).not.toHaveBeenCalled();
    });
  });

  it('appelle registerClient avec les bonnes données', async () => {
    (registerClient as jest.Mock).mockResolvedValueOnce({});
    render(<RegisterClientForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    await waitFor(() => {
      expect(registerClient).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        nom: 'Doe',
        prenom: 'John',
        telephone: '0123456789',
      });
    });

    expect(await screen.findByText(/inscription réussie/i)).toBeInTheDocument();
  });

  it('affiche une erreur si registerClient échoue', async () => {
    (registerClient as jest.Mock).mockRejectedValueOnce({
      data: {
        email: ['Email déjà utilisé'],
        password: ['Mot de passe trop faible']
      }
    });

    render(<RegisterClientForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    await waitFor(() => {
      expect(screen.getByText(/email: Email déjà utilisé/i)).toBeInTheDocument();
      expect(screen.getByText(/password: Mot de passe trop faible/i)).toBeInTheDocument();
    });
  });

  it('désactive le bouton pendant le chargement', async () => {
    const promise = new Promise(resolve => setTimeout(resolve, 200));
    (registerClient as jest.Mock).mockReturnValue(promise);

    render(<RegisterClientForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /inscription/i })).toBeDisabled();;

    await waitFor(() => promise);
  });

  it('affiche le bouton "Se connecter" si onClick est fourni', () => {
    const onClick = jest.fn();
    render(<RegisterClientForm onClick={onClick} />);
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Se connecter'));
    expect(onClick).toHaveBeenCalled();
  });
});
