'use client';

import { useState, useCallback, useRef } from 'react';
import { login } from '@/lib/api/auth/authService';
import Notification from '../Notification';
import Spinner from '../Spinner';

type Props = {
  onClick: () => void;
  onLoginSuccess?: () => void;
}

type LoginResponse = {
  access: string;
  refresh: string;
}

export default function LoginClientForm({onClick, onLoginSuccess}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCloseNotification = useCallback(() => {
    requestAnimationFrame(() => {
      setShowNotification(false);
      setError(null);
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitTimeoutRef.current || isLoading) {
      return;
    }
    setError(null);
    setIsLoading(true);
    submitTimeoutRef.current = setTimeout(() => {
      submitTimeoutRef.current = null;
    }, 1000);
    
    try {
      const res = await login({ email, password }) as LoginResponse;
      if (res.access) {
        localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', res.access);
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess();
          }, 500);
        }
      } else {
        setError('Token non reçu');
        setShowNotification(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isLoading, onLoginSuccess]);

  return (
    <>
      <div className='flex flex-col items-center justify-between p-[10%]  h-full'>
        <h2 className="text-3xl font-bold text-black mt-3">CONNEXION</h2>
        <form onSubmit={handleSubmit} className="gap-4 p-4 flex items-center flex-col w-full">
          <div className="w-full flex flex-col mb-2">
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
          <button 
            type="submit" 
            disabled={isLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[140px] ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <Spinner size="small" color="white" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        <div className='flex justify-center items-center gap-2 mt-4 mb-6 text-black'>
              <span>Pas encore de compte?</span>
            <button onClick={onClick}
              className="font-bold underline"
            >
              S&apos;inscrire
            </button>
        </div>
      </div>
      {showNotification && error && (
        <Notification 
          message={error} 
          type="error" 
          onClose={handleCloseNotification} 
        />
      )}
    </>
  );
}
