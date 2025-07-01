'use client';

import { useState, useCallback, useRef } from 'react';
import { registerClient } from '@/lib/api/authService';
import Notification from '../Notification';
import Spinner from '../Spinner';

type Props = {
  onClick?: () => void;
}

export default function RegisterClientForm({onClick}: Props) {
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState<'error' | 'success'>('error');
    const [isLoading, setIsLoading] = useState(false);
    const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCloseNotification = useCallback(() => {
        requestAnimationFrame(() => {
            setShowNotification(false);
            setError(null);
            setSuccessMessage(null);
        });
    }, []);

    const processError = useCallback((err: any) => {
        if (err.data) {
            const errorMessages = [];
            for (const [field, messages] of Object.entries(err.data)) {
                const message = Array.isArray(messages) ? messages.join(', ') : messages;
                errorMessages.push(`${field}: ${message}`);
            }
            return errorMessages.join(' | ');
        }
        return err.message || 'Erreur inconnue';
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitTimeoutRef.current || isLoading) {
            return;
        }
        
        setError(null);
        setIsLoading(true);
        
        if (!acceptTerms) {
            setError('Vous devez accepter les CGU et la politique de confidentialité');
            setNotificationType('error');
            setShowNotification(true);
            setIsLoading(false);
            return;
        }
        
        submitTimeoutRef.current = setTimeout(() => {
            submitTimeoutRef.current = null;
        }, 1000);
        
        try {
            const res = await registerClient(formData);
            setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            setNotificationType('success');
            setShowNotification(true);
            
            setTimeout(() => {
                if (onClick) {
                    onClick();
                }
            }, 2000);
            
        } catch (err: any) {
            const errorMessage = processError(err);
            setError(errorMessage);
            setNotificationType('error');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    }, [formData, acceptTerms, processError, isLoading, onClick]);

    return (
        <>
            <div className='flex flex-col items-center justify-between p-[10%] h-full'>
                <h2 className="text-3xl font-bold text-black mt-3">INSCRIPTION</h2>
                <form onSubmit={handleSubmit} className="gap-4 p-4 flex items-center flex-col w-full">
                    <div className="w-full flex flex-col mb-2">
                        <input
                            name="email" 
                            type="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            autoComplete='email'
                            className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            autoComplete='new-password'
                            className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <input 
                            name="nom" 
                            type="text"
                            placeholder="Nom" 
                            value={formData.nom} 
                            onChange={handleChange} 
                            required 
                            autoComplete='family-name'
                            className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <input 
                            name="prenom" 
                            type="text"
                            placeholder="Prénom" 
                            value={formData.prenom} 
                            onChange={handleChange} 
                            required
                            autoComplete='given-name'
                            className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full flex flex-col mb-2">
                        <input 
                            name="telephone" 
                            type="tel"
                            placeholder="Téléphone" 
                            value={formData.telephone} 
                            onChange={handleChange} 
                            required 
                            autoComplete='tel'
                            className="w-full border-0 border-b border-black/20 text-black p-2 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full flex items-start gap-2 mb-4">
                        <input 
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="acceptTerms" className="text-sm text-black">
                            J'accepte les{' '}
                            <button 
                                type="button" 
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={() => console.log('Ouvrir CGU')}
                            >
                                Conditions Générales d'Utilisation
                            </button>
                            {' '}et la{' '}
                            <button 
                                type="button" 
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={() => console.log('Ouvrir politique de confidentialité')}
                            >
                                Politique de Confidentialité
                            </button>
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[120px] ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="small" color="white" />
                                Inscription...
                            </>
                        ) : (
                            "S'inscrire"
                        )}
                    </button>
                </form>
                {onClick && (
                    <div className='flex justify-center items-center gap-2 mt-4 mb-6 text-black'>
                        <span>Déjà un compte?</span>
                        <button onClick={onClick}
                            className="font-bold underline"
                        >
                            Se connecter
                        </button>
                    </div>
                )}
            </div>
            {(showNotification && (error || successMessage)) && (
                <Notification 
                    message={error || successMessage || ''} 
                    type={notificationType} 
                    onClose={handleCloseNotification} 
                />
            )}
        </>
    );
}
