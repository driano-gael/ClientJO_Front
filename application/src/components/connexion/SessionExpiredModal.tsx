'use client';

import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;      // Contrôle l'affichage du modal
  onClose: () => void;  // Fonction appelée quand l'utilisateur ferme le modal
  onReconnect: () => void; // Fonction appelée pour rediriger vers la page de connexion
}

export default function SessionExpiredModal({ isOpen, onClose, onReconnect }: Props) {
    
    // État pour le compte à rebours (10 secondes par défaut)
    const [countdown, setCountdown] = useState(10);
    
    // Effet pour gérer le compte à rebours automatique
    useEffect(() => {
        if (!isOpen) {
            setCountdown(10);
            return;
        }
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    onReconnect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen, onReconnect]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-center">
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Session expirée
                </h2>
                <p className="text-gray-600 mb-6">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion dans {countdown} secondes.
                </p>
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Fermer
                    </button>

                    <button
                        onClick={onReconnect}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Se reconnecter maintenant
                    </button>
                </div>
            </div>
        </div>
    );
}
