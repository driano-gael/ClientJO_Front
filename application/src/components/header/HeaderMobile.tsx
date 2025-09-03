'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Profile from './Profile';

export default function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-base-100 relative">
      <nav className="flex items-center justify-between px-4 py-2">

        {/* Menu burger pour mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
            aria-label="Toggle navigation"
          >
            {/* Icône burger */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div style={{ position: 'relative', width: '50px', height: '55px' }}>
            <Image
              src="/images/logofullrect.png"
              alt="Logo JO"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <span className="text-black md:text-xl">Paris 2024 Tickets</span>
        </div>

        {/* Icône de connexion */}
        <Profile />
      </nav>

      {/* Menu déroulant pour mobile */}
      {isMenuOpen && (
        <div className="md:hidden border border-black/20 bg-base-100 px-4 pb-4 animate-slide-down">
          <ul className="flex flex-col text-black gap-4 mt-2 text-lg font-semibold">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
            </li>
            <li>
              <Link href="/evenements" onClick={() => setIsMenuOpen(false)}>Evenements</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
