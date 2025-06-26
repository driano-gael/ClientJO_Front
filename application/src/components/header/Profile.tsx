'use client';

import { useState } from 'react';
import Image from 'next/image';
import ModalAuthentication from '../connexion/modalAuthentication';

export default function Profile() {
  const [showModal, setShowModal] = useState(false);

  return (

    <div className="flex flex-1 items-center justify-end">
      <button onClick={() => setShowModal(true)}>
            <Image
              src="/images/icone_connexion.png"
              alt="Logo JO"
              width={50}
              height={50}
            />
      </button>
      {showModal && <ModalAuthentication onClose={() => setShowModal(false)}/>}
    </div>

  )};