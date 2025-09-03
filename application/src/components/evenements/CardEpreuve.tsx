import {EpreuveCardType} from "@/type/evenement/epreuve";
import Image from "next/image";

type Props = {
  epreuve: EpreuveCardType;
};

export default function CardEpreuve({epreuve}: Props) {
    return (
        <>
            <div className="text-black bg-base-100 w-full flex flex-col px-[2%] align-center items-center my-1 rounded-tl-[20px] rounded-br-[20px]"
            style={{boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)"}}>
                {/* date */}
                <div className="font-bold text-center mt-1">
                    <p className="text-[80%] pt-[1%]">{epreuve.date}</p>
                    <hr className="w-[90%] mx-auto border-[0.1%]"/>
                </div>

                {/* événement */}
                <div className="w-[90%] mx-auto bg-base-300 rounded-[20px] mt-[10px]">
                  <div className="text-center"><b>{epreuve.discipline}</b></div>
                    <div className="flex items-stretch mb-[1%]">

                        {/* icône */}
                        <div className="w-[30%] flex justify-center">
                              <Image
                                src="/images/box.png"
                                alt="Boxe"
                                width={30}
                                height={30}
                                style={{ width: 'auto', height: 'auto' }}
                              />
                        </div>

                        {/* détails */}
                        <div className="w-[70%] flex flex-col items-center justify-center text-center  text-[80%]">

                            <div>{epreuve.libelle}</div>

                        </div>
                    </div>
                    <div className="text-[80%] text-center pb-[1%]">
                        <b>{epreuve.tour}</b>
                    </div>
                  <div className="text-center text-[70%]">{epreuve.genre}</div>
                </div>

                {/* lieu */}
                <div className="text-[70%] text-center pt-[8px] pb-[1%]">
                    <hr className="mb-[1%]"/>
                    <div>{epreuve.lieu}</div>
                    <div>{epreuve.heure}</div>
                </div>
            </div>
        </>

    )
}