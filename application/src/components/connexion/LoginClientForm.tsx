'use client';

import { useState } from 'react';
import { login } from '@/lib/api/authService';

type Props = {
  onClick: () => void;
}

export default function LoginClientForm({onClick}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login({ email, password });
      console.log('Réponse de la connexion:', res);
      if (res.access) {
        localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', res.access);
        console.log('Connexion réussie, token stocké');
        // Ici, redirection ou fermeture modal etc.
      } else {
        setError('Token non reçu');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    }
  };

  return (
    <>
      <div className='flex flex-col items-center justify-between p-[10%]  h-full'>
        <h2 className="text-3xl font-bold text-black mt-3">CONNEXION</h2>
        <form onSubmit={handleSubmit} className="gap-4 p-4 flex items-center flex-col w-full">
          <div className="w-full flex flex-col mb-2">
            {/* <label htmlFor="email" className="text-black  font-bold text-xl">Email</label> */}
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              required
              className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
            />
          </div>
          <div className="w-full flex flex-col mb-2">
            {/* <label htmlFor="password" className="mb-1 text-sm text-gray-700 font-medium">Mot de passe</label> */}
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              required
              className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Se connecter</button>
        </form>
        <div className='flex justify-center items-center gap-2 mt-4'>
              <span>Pas encore de compte?</span>
            <button onClick={onClick}
              className=""
            >
              S'inscrire
            </button>
        </div>
      </div>
    </>
  );
}
