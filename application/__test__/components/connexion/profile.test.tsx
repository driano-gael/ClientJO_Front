import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '@/components/header/Profile';
import { AuthProvider } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import panierSlice from '@/lib/reducer/panier/panierSlice';
import { PanierState, OffrePanier } from '@/type/achat/offrePanier';

// On mock le composant ModalAuthentication
jest.mock('@/components/connexion/modalAuthentication', () => ({
  __esModule: true,
  default: function MockModalAuthentication({ onClose }: { onClose?: () => void }) {
    const [visible, setVisible] = useState(true);
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

// Import du vrai hook pour pouvoir le spy
import * as userContext from '@/context/userContext';

describe('Profile component', () => {
  beforeEach(() => {
    (useRouter as unknown as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  function renderWithProviders(panierState: PanierState = { items: [] }) {
    const store = configureStore({
      reducer: { panier: panierSlice },
      preloadedState: { panier: panierState },
    });
    return render(
      <Provider store={store}>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </Provider>
    );
  }

  it('affiche le bouton avec l\'image', () => {
    jest.spyOn(userContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn(),
    });
    renderWithProviders();
    const image = screen.getByAltText('profil');
    expect(image).toBeInTheDocument();
  });

  it('ouvre le modal après clic sur le bouton', () => {
    jest.spyOn(userContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn(),
    });
    renderWithProviders();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Modal Authentication')).toBeInTheDocument();
  });

  it('ferme le modal après clic sur "Fermer"', () => {
    jest.spyOn(userContext, 'useAuth').mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn(),
    });
    renderWithProviders();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const closeButton = screen.getByText('Fermer');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Modal Authentication')).not.toBeInTheDocument();
  });

  it('affiche le badge du panier si des offres sont présentes', () => {
    jest.spyOn(userContext, 'useAuth').mockReturnValue({
      user: { id: '1', nom: 'Test User', email: 'test@test.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn(),
    });
    renderWithProviders({
      items: [
        { evenementId: 1, offreId: 1, quantity: 2 } as OffrePanier,
        { evenementId: 1, offreId: 2, quantity: 1 } as OffrePanier,
      ],
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
