import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock des composants
jest.mock('@/components/header/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('@/components/home/HomeDescription', () => {
  return function MockHomeDescription() {
    return <div data-testid="home-description">Home Description</div>;
  };
});

jest.mock('@/components/home/HomePresentation', () => {
  return function MockHomePresentation() {
    return <div data-testid="home-presentation">Home Presentation</div>;
  };
});

describe('Home Page', () => {
  it('affiche la page d\'accueil', () => {
    render(<Home />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('home-description')).toBeInTheDocument();
    expect(screen.getByTestId('home-presentation')).toBeInTheDocument();
  });

  it('affiche les composants dans le bon ordre', () => {
    const { container } = render(<Home />);

    const elements = container.querySelectorAll('[data-testid]');
    expect(elements[0]).toHaveAttribute('data-testid', 'header');
    expect(elements[1]).toHaveAttribute('data-testid', 'home-description');
    expect(elements[2]).toHaveAttribute('data-testid', 'home-presentation');
  });
});

