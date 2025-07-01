'use client';

import { useState } from 'react';
import LoginClientForm from './LoginClientForm';
import RegisterClientForm from './RegisterClientForm';

type Props = {
  onClose: () => void;
}

export default function ModalAuthentication({onClose}: Props) {
  const [isRegister, setIsRegister] = useState(true);
  const toggleOnRegister = () => {
    setIsRegister(!isRegister);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80">
        <div
          className="relative bg-base-300 m-[2%] rounded-xl w-full max-w-[400px] h-[650px] border"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            <img 
              src="/images/close-arrow(24).png" 
              alt="Fermer" 
              width={24} 
              height={24}
            />
          </button>
          {isRegister
            ? (<LoginClientForm onClick={toggleOnRegister} onLoginSuccess={onClose}/>)
            : (<RegisterClientForm onClick={toggleOnRegister}/>)
          }
        </div>
      </div>
    </>
  );
}
