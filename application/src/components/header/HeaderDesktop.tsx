import Link from 'next/link';
import Image from 'next/image';
import Profile from './Profile';

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

<div className="mx-auto inline-flex items-stretch border border-black rounded-full overflow-hidden">
  <Link
    href="/"
    className="flex-1 flex items-center justify-center text-center font-bold text-xl pr-5 pl-10 py-2 hover:bg-[#ffe0b3] transition-colors duration-300"
  >
    Accueil
  </Link>

  <span className="w-[1px] h-[75%] bg-black self-center" />

  <Link
    href="/evenements"
    className="flex-1 flex items-center justify-center text-center font-bold text-xl pr-10 pl-5 py-2 whitespace-nowrap hover:bg-[#ffe0b3] transition-colors duration-300"
  >
    Les évènements
  </Link>
</div>



        <Profile />
      </nav>
    </header>
  );
}