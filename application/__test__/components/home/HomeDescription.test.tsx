import { render, screen } from '@testing-library/react';
import HomeDescription from '@/components/home/HomeDescription';

describe('HomeDescription', () => {
  it('rend le composant sans erreur', () => {
    render(<HomeDescription />);
    // Le composant utilise une section, pas un élément main
    expect(screen.getByRole('heading', { name: /Bienvenue aux jeux olympiques de Paris 2024/i })).toBeInTheDocument();
  });

  it('affiche le titre principal', () => {
    render(<HomeDescription />);
    expect(screen.getByText(/Paris 2024/i)).toBeInTheDocument();
  });

  it('structure correctement les éléments', () => {
    render(<HomeDescription />);
    // Chercher la section au lieu de main
    const sectionElement = screen.getByRole('heading').closest('section');
    expect(sectionElement).toHaveClass('flex', 'flex-col');
  });
});
