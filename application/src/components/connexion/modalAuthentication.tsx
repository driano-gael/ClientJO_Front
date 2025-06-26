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
          className="relative bg-base-300 m-[2%] rounded-xl w-full max-w-[400px] h-[600px] border"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-black hover:text-red-500"
            aria-label="Fermer"
          >
            <span>Fermer</span>
          </button>
          {isRegister
            ? (<LoginClientForm onClick={toggleOnRegister}/>)
            : (<RegisterClientForm />)
          }
        </div>
      </div>
    </>
  );
}
