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
            <div className="pt-4 pb-4">
              <SearchEvenements/>
            </div>

            <div>
              <CarousselEvenements/>
            </div>

            <div>
              <DisplayedEvenements/>
            </div>
      </div>

    </>
  );
}