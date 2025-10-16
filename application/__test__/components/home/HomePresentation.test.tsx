import { render, screen } from '@testing-library/react';
import HomePresentation from '@/components/home/HomePresentation';

describe('HomePresentation', () => {
  it('affiche les titres des sections', () => {
    render(<HomePresentation />);

    // Le composant affiche 3 titres h2
    const titles = screen.getAllByRole('heading', { level: 2 });
    expect(titles).toHaveLength(3);
  });

  it('affiche les descriptions de chaque section', () => {
    render(<HomePresentation />);

    // Vérifier qu'il y a au moins 3 paragraphes
    const paragraphs = document.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });

  it('affiche les trois images', () => {
    render(<HomePresentation />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    expect(screen.getByAltText('Jeux Olympiques Paris 2024')).toBeInTheDocument();
    expect(screen.getByAltText('Monument Paris 2024')).toBeInTheDocument();
    expect(screen.getByAltText('Paris la verte 2024')).toBeInTheDocument();
  });

  it('structure correctement la section', () => {
    render(<HomePresentation />);

    // Trouver l'élément section directement
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('utilise des classes CSS appropriées', () => {
    render(<HomePresentation />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('mx-[3%]', 'my-[40px]', 'bg-base-100');
  });
});
