'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginClientForm from './LoginClientForm';
import RegisterClientForm from './RegisterClientForm';
import ReactDOM from "react-dom";

type Props = {
  onCloseAction: () => void;
}

export default function ModalAuthentication({onCloseAction}: Props) {
  const [isRegister, setIsRegister] = useState(true);
    if (typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;
  const toggleOnRegister = () => {
    setIsRegister(!isRegister);
  }

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 z-[100]">
        <div
          className="relative bg-base-300 m-[2%] rounded-xl w-full max-w-[400px] h-[650px] border"
        >
          <button
            onClick={onCloseAction}
            className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            <Image 
              src="/images/close-arrow(24).png" 
              alt="Fermer" 
              width={24} 
              height={24}
            />
          </button>
          {isRegister
            ? (<LoginClientForm onClick={toggleOnRegister} onLoginSuccess={onCloseAction}/>)
            : (<RegisterClientForm onClick={toggleOnRegister}/>)
          }
        </div>
      </div>
    </>,
    modalRoot
  );
}
