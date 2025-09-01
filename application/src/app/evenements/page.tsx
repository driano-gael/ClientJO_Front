'use client';
import Header from "@/components/header/Header";
import CarousselEvenements from "@/components/evenements/CarousselEvenements";
import SearchEvenements from "@/components/evenements/searchEvenements";
import DisplayedEvenements from "@/components/evenements/DisplayedEvenements";

export default function Evenements() {
  return (
    <>
      <Header/>
        <div className="bg-base-200">
            <div  className="w-[90%] mx-auto">
                <div className="pt-4 pb-4">
                  <SearchEvenements/>
                </div>

                <div>
                    <p className="font-extrabold">A VENIR</p>
                    <hr className="border-1"/>
                    <CarousselEvenements/>
                </div>

            <div>
                <p className="font-extrabold">A L&apos;AFFICHE</p>
                <hr className="border-1"/>
                <DisplayedEvenements/>
            </div>
      </div>
</div>
    </>
  );
}