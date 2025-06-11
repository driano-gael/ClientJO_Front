import Link from 'next/link';
import Image from 'next/image';

export default function HeaderDesktop() {
  return (
    <header className="bg-base-100">
      <nav className="bg-base-100 text-black mx-auto flex justify-between px-[40px] py-[10px]">
        <div className="flex flex-1 items-center gap-2">
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
        <div className="flex items-center justify-center gap-6 px-[20px] border border-black rounded-full mx-auto">
          <Link className="items-center justify-center font-bold text-2xl" href="/">Accueil</Link>
          <span className="h-6 border-l border-black"></span>
          <Link className="items-center justify-center font-bold text-2xl" href="/offre">Offres</Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <Link href={"/connexion"}>
            <Image
              src="/images/icone_connexion.png"
              alt="Logo JO"
              width={50}
              height={50}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}