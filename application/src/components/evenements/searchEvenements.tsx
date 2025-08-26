import useIsMobile from "@/hook/useIsMobile";
import Image from "next/image";
import {useState} from "react";

export default function SearchEvenements(){
  const isMobile = useIsMobile();
  const [searchIsExpend, setSearchIsExpend] = useState(false);
  if (isMobile) {
    return (
      <>
        <div
          className={`text-black w-[90%] bg-base-100 flex items-center justify-center mx-auto rounded-[20px] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300 ${searchIsExpend ? 'h-[140px]' : 'h-[40px]'}`}
          onClick={() => setSearchIsExpend(!searchIsExpend)}>
          <h2 className="text-sm text-center font-bold">Rechercher</h2>
            <div className="px-2">
              <Image
                src="/images/searchIcon(24).png"
                width={20}
                height={20}
                alt="searchIcon"
                className=""
              />
            </div>
        </div>
      </>
    )
  }else{
    return (
      <>
        <div className="text-black w-[85%] h-[50px] bg-base-100 flex items-center justify-center mx-auto rounded-[40px]">
          <h2 className="text-md text-center font-bold">Search Evenements Placeholder</h2>
        </div>
      </>
    )
  }
}