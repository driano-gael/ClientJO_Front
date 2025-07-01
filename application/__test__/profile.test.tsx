import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '@/components/header/Profile';

// On mock le composant ModalAuthentication
jest.mock('@/components/connexion/modalAuthentication', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      <div>Modal Authentication</div>
      <button onClick={onClose}>Fermer</button>
    </div>
  ),
}));

describe('Profile component', () => {
  it('affiche le bouton avec l’image', () => {
    render(<Profile />);
    const image = screen.getByAltText('Logo JO');
    expect(image).toBeInTheDocument();
  });

  it('ouvre le modal après clic sur le bouton', () => {
    render(<Profile />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Modal Authentication')).toBeInTheDocument();
  });

  it('ferme le modal après clic sur "Fermer"', () => {
    render(<Profile />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Modal Authentication')).not.toBeInTheDocument();
  });
});
// 