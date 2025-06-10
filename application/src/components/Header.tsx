import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-base-100 p-4">
      <nav className="bg-base-200 text-black mx-auto flex justify-between">
        <div className="flex items-center gap-2">
          <div style={{ position: 'relative', width: '65px', height: '70px' }}>
            <Image
              src="/images/logofullrect.png"
              alt="Logo JO"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className='font-bold'>Paris 2024 Tickets</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className='font-bold text-2xl' href="/">Accueil</Link>
          <Link className='font-bold text-2xl' href="/offre">Offres</Link>
        </div>
        <div>
          <Link href={"/connexion"}>
            <Image
            src="/images/icone_connexion.png"
            alt="Logo JO"
            width={70}
            height={70}/>
          </Link>
        </div>
      </nav>
    </header>
  );
}