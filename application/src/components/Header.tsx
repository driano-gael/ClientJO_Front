import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/">Accueil</Link>
        <Link href="/offre">Offres</Link>
      </nav>
    </header>
  );
}