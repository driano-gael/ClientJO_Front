interface Props {
    date: string;
    discipline: string;
    gender: string;
    categorie: string;
    tour: string;
    lieu: string;
    heure: string;
}


export default function CardEvenement(props: Props) {
    return (
        <>
            <div className="text-black bg-base-100 w-full flex flex-col px-[2%] align-center items-center my-1 rounded-tl-[20px] rounded-br-[20px]"
            style={{boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)"}}>
                {/* date */}
                <div className="font-bold text-center mt-1">
                    <p className="text-[80%] pt-[1%]">{props.date}</p>
                    <hr className="w-[90%] mx-auto border-[0.1%]"/>
                </div>

                {/* événement */}
                <div className="w-[90%] mx-auto bg-base-300 rounded-[20px] mt-[10px]">
                  <div className="text-center"><b>{props.discipline}</b></div>
                    <div className="flex items-stretch mb-[1%]">

                        {/* icône */}
                        <div className="w-[30%] flex justify-center">
                            <img
                                src="/images/box.png"
                                alt="Boxe"
                                className="w-[30px] my-auto"
                            />
                        </div>

                        {/* détails */}
                        <div className="w-[70%] flex flex-col items-center justify-center text-center  text-[80%]">

                            <div>{props.categorie}</div>

                        </div>
                    </div>
                    <div className="text-[80%] text-center pb-[1%]">
                        <b>{props.tour}</b>
                    </div>
                  <div className="text-center text-[70%]">{props.gender}</div>
                </div>

                {/* lieu */}
                <div className="text-[70%] text-center pt-[8px] pb-[1%]">
                    <hr className="mb-[1%]"/>
                    <div>{props.lieu}</div>
                    <div>{props.heure}</div>
                </div>
            </div>
        </>

    )
}