import { render, screen, fireEvent } from '@testing-library/react';
import ModalAuthentication from '@/components/connexion/modalAuthentication';

jest.mock('@/components/connexion/LoginClientForm', () => ({
  __esModule: true,
  default: ({ onClick, onLoginSuccess }: { onClick: () => void; onLoginSuccess: () => void }) => (
    <div>
      <p>Login Form</p>
      <button onClick={onClick}>Switch to Register</button>
      <button onClick={onLoginSuccess}>Login Success</button>
    </div>
  ),
}));

jest.mock('@/components/connexion/RegisterClientForm', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <div>
      <p>Register Form</p>
      <button onClick={onClick}>Switch to Login</button>
    </div>
  ),
}));

describe('ModalAuthentication component', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    mockClose.mockClear();
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) document.body.removeChild(modalRoot);
  });

  it('affiche le LoginClientForm par défaut', () => {
    render(<ModalAuthentication onCloseAction={mockClose} />);
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('bascule vers le RegisterClientForm quand on clique sur "Switch to Register"', () => {
    render(<ModalAuthentication onCloseAction={mockClose} />);
    fireEvent.click(screen.getByText('Switch to Register'));
    expect(screen.getByText('Register Form')).toBeInTheDocument();
  });

  it('bascule à nouveau vers le LoginClientForm quand on clique sur "Switch to Login"', () => {
    render(<ModalAuthentication onCloseAction={mockClose} />);
    fireEvent.click(screen.getByText('Switch to Register'));
    fireEvent.click(screen.getByText('Switch to Login'));
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('ferme le modal en cliquant sur le bouton "X"', () => {
    render(<ModalAuthentication onCloseAction={mockClose} />);
    const closeButton = screen.getByLabelText('Fermer');
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('ferme le modal quand le login réussit', () => {
    render(<ModalAuthentication onCloseAction={mockClose} />);
    fireEvent.click(screen.getByText('Login Success'));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
