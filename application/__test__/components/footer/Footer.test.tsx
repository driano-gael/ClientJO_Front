import { render, screen } from '@testing-library/react';
import Footer from '@/components/footer/Footer';

describe('Footer', () => {
  it('affiche le copyright', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2025 ClientJO. Tous droits réservés./i)).toBeInTheDocument();
  });

  it('a les bonnes classes CSS', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toHaveClass('bg-gray-900', 'text-white', 'p-4', 'text-center', 'mt-10');
  });
});

