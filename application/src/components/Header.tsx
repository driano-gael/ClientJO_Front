import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-base-100 p-4">
      <nav className="container bg-base-200 text-black mx-auto flex justify-between">
        <Link href="/">Accueil</Link>
        <Link href="/offre">Offres</Link>
      </nav>
    </header>
  );
}