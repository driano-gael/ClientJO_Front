'use client';

import { useState } from 'react';
import { login } from '@/lib/api/authService';

export default function LoginClientForm() {
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete='email'
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete='current-password'
        required
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Se connecter</button>
    </form>
  );
}
