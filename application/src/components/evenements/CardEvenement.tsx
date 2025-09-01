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
            <div
                className="text-black bg-base-100 w-full flex flex-col px-[2%] align-center items-center my-[10px] rounded-[20px]">
                {/* date */}
                <div className="font-bold text-center mt-[10px]">
                    <p className="text-[60%] pt-[1%]">{props.date}</p>
                    <hr className="w-[90%] mx-auto border-[0.1%]"/>
                </div>

                {/* événement */}
                <div className="w-[90%] mx-auto bg-base-300 rounded-[20px] mt-[10px]">
                    <div className="flex items-stretch mt-[10px] mb-[1%]">

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
                            <div><b>{props.discipline}</b></div>
                            <div>{props.categorie}</div>
                            <div>{props.gender}</div>
                        </div>
                    </div>
                    <div className="text-[70%] text-center pb-[1%]">
                        <b>{props.tour}</b>
                    </div>
                </div>

                {/* lieu */}
                <div className="text-[50%] text-center pt-[8px] pb-[1%]">
                    <hr className="mb-[1%]"/>
                    <div>{props.lieu}</div>
                    <div>{props.heure}</div>
                </div>
            </div>
        </>

    )
}