import { render, screen } from '@testing-library/react';
import Header from '@/components/header/Header';
import useIsMobile from '@/hook/useIsMobile';

// Mock des composants enfants
jest.mock('@/components/header/HeaderMobile', () => {
  return function MockHeaderMobile() {
    return <div data-testid="header-mobile">Header Mobile</div>;
  };
});

jest.mock('@/components/header/HeaderDesktop', () => {
  return function MockHeaderDesktop() {
    return <div data-testid="header-desktop">Header Desktop</div>;
  };
});

// Mock du hook useIsMobile
jest.mock('@/hook/useIsMobile');

const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

describe('Header', () => {
  it('affiche HeaderMobile sur mobile', () => {
    mockUseIsMobile.mockReturnValue(true);

    render(<Header />);

    expect(screen.getByTestId('header-mobile')).toBeInTheDocument();
    expect(screen.queryByTestId('header-desktop')).not.toBeInTheDocument();
  });

  it('affiche HeaderDesktop sur desktop', () => {
    mockUseIsMobile.mockReturnValue(false);

    render(<Header />);

    expect(screen.getByTestId('header-desktop')).toBeInTheDocument();
    expect(screen.queryByTestId('header-mobile')).not.toBeInTheDocument();
  });
});

