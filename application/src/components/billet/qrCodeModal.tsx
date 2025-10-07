
import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "@/type/achat/qrCode";
import Spinner from "@/components/common/Spinner";
import {QrCodeService} from "@/lib/api/service/qrCodeService"; // Assure-toi que ce chemin est correct

type props = {
  handleCloseModal: () => void;
  ticket_id: number;
};

export default function QRCodeModal({ handleCloseModal, ticket_id }: props) {
  const [qrCodeData, setQrCodeData] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  if (!ticket_id) {
    handleCloseModal();
    return;
  }
  const fetchQrCode = async () => {
    try {
      setLoading(true);
      console.log("Fetching QR Code...");
      const data = await QrCodeService.getQrCodeClient(ticket_id);
      setQrCodeData(data);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };
  fetchQrCode();
}
, [ticket_id, handleCloseModal]);


  return (
    <>
      {loading && <Spinner/>}
      <div className="flex flex-col items-center justify-between p-[10%] h-full">
        <div className="w-full flex justify-end">
          <button onClick={handleCloseModal}>x</button>
        </div>
        {qrCodeData && (
          <Image
            src={`data:image/png;base64,${qrCodeData.data}`}
            alt="QR Code"
            width={200}
            height={200}
          />
        )}
      </div>
    </>
  );
}