import { render, screen } from '@testing-library/react';
import SearchEpreuve from '@/components/evenements/searchEpreuve';
import useIsMobile from '@/hook/useIsMobile';
import { EpreuveFilters, Epreuve } from '@/type/evenement/epreuve';

// Mock des composants enfants
jest.mock('@/components/evenements/SearchEpreuveMobile', () => {
  return function MockSearchEpreuveMobile() {
    return <div data-testid="search-mobile">Search Mobile</div>;
  };
});

jest.mock('@/components/evenements/SearchEpreuveDesktop', () => {
  return function MockSearchEpreuveDesktop() {
    return <div data-testid="search-desktop">Search Desktop</div>;
  };
});

jest.mock('@/hook/useIsMobile');

const mockUseIsMobile = useIsMobile as jest.MockedFunction<typeof useIsMobile>;

const mockEpreuves: Epreuve[] = [];
const mockFilters: EpreuveFilters = {};
const mockOnFiltersChange = jest.fn();

describe('SearchEpreuve', () => {
  it('affiche SearchEpreuveMobile sur mobile', () => {
    mockUseIsMobile.mockReturnValue(true);

    render(
      <SearchEpreuve
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    expect(screen.getByTestId('search-mobile')).toBeInTheDocument();
  });

  it('affiche SearchEpreuveDesktop sur desktop', () => {
    mockUseIsMobile.mockReturnValue(false);

    render(
      <SearchEpreuve
        onFiltersChange={mockOnFiltersChange}
        filters={mockFilters}
        epreuves={mockEpreuves}
      />
    );

    expect(screen.getByTestId('search-desktop')).toBeInTheDocument();
  });
});

