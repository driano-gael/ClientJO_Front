'use client';

import { useEffect, useCallback, useRef } from 'react';
import Spinner from "@/components/common/Spinner";
import {NotificationProps} from "@/type/common/notification";


export default function Notification({ message, type = 'error', onCloseAction = () => {}, duration = 3000 }: NotificationProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    onCloseAction();
  }, [onCloseAction]);

  useEffect(() => {
    // Nettoyer le timer précédent
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Créer un nouveau timer
    timerRef.current = setTimeout(() => {
      onCloseAction();
    }, duration);

    // Cleanup à la destruction du composant
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onCloseAction]);

  const getTypeStyles = useCallback(() => {
    switch (type) {
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-red-500 border-red-600';
    }
  }, [type]);

  return (
    <div className={`fixed top-1/2 left-1/2 z-[60] transform -translate-x-1/2 -translate-y-1/2 ${getTypeStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-[400px] animate-slide-in`}>
      {type === 'success' && message.includes('Redirection') && (
        <div className="flex items-center gap-2">
          <Spinner size="small" color="white"/>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-3 text-white hover:text-gray-200 font-bold text-lg"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 ${type === 'error' ? 'bg-red-300' : type === 'success' ? 'bg-green-300' : 'bg-blue-300'} animate-progress${type === 'success' ? ' success' : ''}`}></div>
    </div>
  );
}
