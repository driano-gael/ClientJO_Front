import { render, screen, fireEvent } from '@testing-library/react';
import HeaderMobile from '@/components/header/HeaderMobile';
import * as userContextModule from '@/context/userContext';

// Mock du composant Profile
jest.mock('@/components/header/Profile', () => {
  return function MockProfile() {
    return <div data-testid="profile">Profile</div>;
  };
});

// Mock de Next.js Image et Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>{children}</a>
  )
}));

describe('HeaderMobile', () => {
  beforeEach(() => {
    jest.spyOn(userContextModule, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      forceLogout: jest.fn(),
      currentRoute: null,
      saveCurrentRoute: jest.fn(),
      getAndClearSavedRoute: jest.fn(),
      isLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le header mobile avec le logo et le titre', () => {
    render(<HeaderMobile />);

    expect(screen.getByText(/Paris 2024 Tickets/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Logo JO/i)).toBeInTheDocument();
  });

  it('affiche le bouton burger', () => {
    render(<HeaderMobile />);

    const burgerButton = screen.getByLabelText(/Toggle navigation/i);
    expect(burgerButton).toBeInTheDocument();
  });

  it('affiche le composant Profile', () => {
    render(<HeaderMobile />);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });

  it('n\'affiche pas le menu au démarrage', () => {
    render(<HeaderMobile />);

    expect(screen.queryByText(/Accueil/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Evenements/i)).not.toBeInTheDocument();
  });

  it('ouvre le menu au clic sur le bouton burger', () => {
    render(<HeaderMobile />);

    const burgerButton = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(burgerButton);

    expect(screen.getByText(/Accueil/i)).toBeInTheDocument();
    expect(screen.getByText(/Evenements/i)).toBeInTheDocument();
  });

  it('ferme le menu au second clic sur le bouton burger', () => {
    render(<HeaderMobile />);

    const burgerButton = screen.getByLabelText(/Toggle navigation/i);

    // Ouvrir
    fireEvent.click(burgerButton);
    expect(screen.getByText(/Accueil/i)).toBeInTheDocument();

    // Fermer
    fireEvent.click(burgerButton);
    expect(screen.queryByText(/Accueil/i)).not.toBeInTheDocument();
  });

  it('ferme le menu au clic sur un lien', () => {
    render(<HeaderMobile />);

    const burgerButton = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(burgerButton);

    const accueilLink = screen.getByText(/Accueil/i);
    fireEvent.click(accueilLink);

    expect(screen.queryByText(/Accueil/i)).not.toBeInTheDocument();
  });

  it('contient les liens de navigation corrects', () => {
    render(<HeaderMobile />);

    const burgerButton = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(burgerButton);

    const accueilLink = screen.getByText(/Accueil/i).closest('a');
    const evenementsLink = screen.getByText(/Evenements/i).closest('a');

    expect(accueilLink).toHaveAttribute('href', '/');
    expect(evenementsLink).toHaveAttribute('href', '/evenements');
  });
});
