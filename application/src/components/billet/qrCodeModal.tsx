import {useEffect, useState} from "react";
import QrCodeTicket from "@/type/achat/qrCode_ticket";

ty

export default function QrCodeModal(ticketId: number) {
  const [qsrCodeTicket, setQrCodeTicket] = useState<QrCodeTicket|null>(null)

    useEffect(() => {

    }, []);

  return (

    <>

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">QR Code du billet</h2>
            {qsrCodeTicket ? (
              <img src={qsrCodeTicket.data} alt={`QR Code ticket ${ticketId}`} className="mx-auto" />
            ) : (
              <p>Chargement du QR Code...</p>
            )}
          </div>
        </div>
    </>
  );
}