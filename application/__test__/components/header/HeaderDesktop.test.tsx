import { render, screen } from '@testing-library/react';
import HeaderDesktop from '@/components/header/HeaderDesktop';

// Mock du composant Profile
jest.mock('@/components/header/Profile', () => {
  return function MockProfile() {
    return <div data-testid="mock-profile">Profile</div>;
  };
});

describe('HeaderDesktop', () => {
  it('affiche le logo Paris 2024', () => {
    render(<HeaderDesktop />);

    const logo = screen.getByAltText('Logo JO');
    expect(logo).toBeInTheDocument();
  });

  it('affiche le titre Paris 2024 Tickets', () => {
    render(<HeaderDesktop />);

    expect(screen.getByText('Paris 2024 Tickets')).toBeInTheDocument();
  });

  it('affiche le composant Profile', () => {
    render(<HeaderDesktop />);

    expect(screen.getByTestId('mock-profile')).toBeInTheDocument();
  });

  it('contient les liens de navigation', () => {
    render(<HeaderDesktop />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});

