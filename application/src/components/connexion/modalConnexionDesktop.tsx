'use client';

import LoginClientForm from './LoginClientForm';
import RegisterClientForm from './RegisterClientForm';

type Props = {
  onClose: () => void;
}

export default function ModalConnexionDesktop({onClose}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          aria-label="Fermer"
        >
          <span>Fermer</span>
        </button>

        <h2 className="text-xl font-bold mb-4">Inscription</h2>
        {/* <RegisterClientForm /> */}
        <LoginClientForm />
      </div>
    </div>
  );
}
