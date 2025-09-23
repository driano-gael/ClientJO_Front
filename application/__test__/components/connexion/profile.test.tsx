import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '@/components/header/Profile';
import { AuthProvider } from '@/context/userContext';
import { useRouter } from 'next/navigation';

// On mock le composant ModalAuthentication
jest.mock('@/components/connexion/modalAuthentication', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose?: () => void }) => {
    const [visible, setVisible] = React.useState(true);
    const handleClose = () => {
      setVisible(false);
      if (typeof onClose === 'function') onClose();
    };
    if (!visible) return null;
    return (
      <div>
        <div>Modal Authentication</div>
        <button onClick={handleClose}>Fermer</button>
      </div>
    );
  },
}));
jest.mock('next/navigation');

describe('Profile component', () => {
  beforeEach(() => {
    (useRouter as unknown as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('affiche le bouton avec l’image', () => {
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );
    const image = screen.getByAltText('profil');
    expect(image).toBeInTheDocument();
  });

  it('ouvre le modal après clic sur le bouton', () => {
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Modal Authentication')).toBeInTheDocument();
  });

  it('ferme le modal après clic sur "Fermer"', () => {
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Modal Authentication')).not.toBeInTheDocument();
  });
});
