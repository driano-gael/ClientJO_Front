import {Offre} from "@/type/achat/offre";
import Image from 'next/image';
import {useState} from "react";


type Props = {
  offre: Offre
  quantity: number
}

export default function CardOffre({offre, quantity}: Props) {
  const[remainingPlace, setRemainingPlace] = useState(quantity);
  return (
    <>
      <div className="flex flex-col items-center border border-accent rounded-[10px]">
        <h3 className="text-xl font-bold mb-2">{offre.libelle}</h3>
        <p className="mb-2">{offre.description}</p>
        <p className="text-lg font-semibold">Prix : {offre.montant} €</p>
        <div className="flex items-center bg-base-200 gap-3 p-1 mb-1 rounded-2xl">
          <button>
            <Image
              src="/images/minus.png"
              alt="moins"
              width={20}
              height={20}
            />
          </button>
          <span className="text-lg font-medium text-gray-800 min-w-[30px] text-center">
              0
          </span>
          <button>
            <Image
              src="/images/add.png"
              alt="plus"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}